import { FastifyInstance } from "fastify" //
import { prisma } from "./lib/prisma"
import { z } from 'zod'
import dayjs from "dayjs"

//Precisamos dizer o formato da informação de 'app' que vamos usar em typescript
//Importante: todo arquivo que fazemos um '.register' do fastify, obrigatoriamente precisa ser uma funcao assincrona
export async function appRoutes(app: FastifyInstance){

    //Atraves dessa requisiçao quero obter o titulo e os weekdays digitados e escolhidos pelo usuarios
    app.post('/habits', async (request) => {
        const createHabitBody = z.object({
            title: z.string(), //.nullable() -> caso eu quero que um campo nao seja obrigatorio
            weekDays: z.array(
                z.number().min(0).max(6) //Desejo pegar apenas um array com valores entre 0 a 6
            )
        })
        const { title, weekDays } = createHabitBody.parse(request.body) //Automaticamente o zod avalia os dados que foram
                                                                       //passados para gente e se os dados nao tiverem 
                                                                       //sido preenchidos de forma correta, dará erro 
        //starOf('day') -> zera/descarta as horas minutos e segundo                                    
        const today = dayjs().startOf('day').toDate()
        
        await prisma.habit.create({
            data: {
                title: title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay 
                        }
                    })
                }
            }
        })
    })
    
    //Pega todos os habitos daquele dia ao a pessoa clicar naquele dia da tabela, retornando os todos os habitos e se foram
    //completos ou nao
    app.get('/dayInfo', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date() // coerce: converte o parametro que eu receber dentro do date em uma data  
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day') // -> Aqui pegamos o dia da semana nessa data

        //Retorna a lista de habitos daquele dia que o usario quer ver
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date, //lte -> menor ou igual a data atual, pois eu nao posso mostrar habitos criados no futuro
                },
                weekDays: { //Realizamos junção automaticamente a partir disso
                    some: {  //Procuraremos habitos onde tenha pelo menos um dia da semana cadastrado e weed_day seja igual ao dia da semana que estamos recebendo nessa data
                        week_day: weekDay,
                    }
                }
                
            }
        })

        //Aqui eu pego todos os habitos desse dia, que o usario está vendo, que estão completados, ou seja, todos os 
        //habitos que estao na tabela day_habits e nesse dia
        const day = await prisma.day.findUnique({
            where:{
                date: parsedDate.toDate(),
            }, 
            include: { 
                dayHabits: true //Pego todos os dayHabits automaticamente que estão relacionados com esse dia
            }
        })
        
        // ?. -> verifica se o 'day' não é nulo (pois eu posso não ter completado nenhum habito naquele dia)
        //Retorno apenas o id dos habitos que foram completados naquele dia (ja que não preciso de todas as informações)
        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? [] //Caso o valor esteja indefinido, ou seja, não tenhamos completado nenhum habito aquele dia, 
                 //retornamos um array vazio

        return {
            possibleHabits, completedHabits,
        }
    })
    
    //Através dessa rota o usuario poderá completar ou descompletar um habito do dia
    //patch é similar ao update
    //:id = route param, que é um parametro de identificação, ou seja eu estou querendo pegar o unico habito que possui 
    //o id x
    app.patch('/habits/:id/toggle', async (request) =>{
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        //Ou encontro um registro ja existente de um dia que possui habito concluido ou eu crio um novo registro
        //para concluir um habito naquele dia que cliquei
        let day = await prisma.day.findUnique({
            where: {
                date: today,
            }
        })
        if(!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const DayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        //Se encontrou o dayHabit, ou seja, ja tinha sido marcado como completo e quero desmarcar, eu preciso apagar 
        //o dayHabit existente
        //Lembrar: na tabela day_habit relacionamos um dia com um habito. Se existir um registro nessa tabela
        //relacionando certo dia com certo habito, quer dizer que esse habito foi marcado como completo naquele dia 
        if (DayHabit) {
            //Aqui desmarcamos o habito como completo naquele dia
            await prisma.dayHabit.delete({
                where:{
                    id: DayHabit.id
                } 
            })
        }
        else{
            //Aqui agora completamos um habito naquele dia.
            await prisma.dayHabit.create({
                data:{
                    day_id: day.id,
                    habit_id: id,
                }
            })
        }
    })

    //Retornaremos uma lista/array com varias informações dentro dessa lista, onde cada uma dessas informações é um 
    //objeto do javascript e cada um deles terá 3 informacoes: data (dia especifico), quantos habitos eram POSSIVEIS serem
    //completados naquela data (no caso um dia da semana especificio de acordo com a data(domingo, segunda, terça, ...)) e
    //quantos habitos eu consegui completar nessa data  
    //Exemplo: [ {date: 20/01, amount: 5, completed: 1} , {date: 21/01, amount: 2, completed: 2}, {},  ...]
    app.get('/summary', async () => {
        //Aqui faremos o sql na mao = (RAW)
        const summary = await prisma.$queryRaw`
            SELECT D.id, D.date, (SELECT cast(count(*) as float)
                                    FROM day_habit AS DH
                                    WHERE DH.day_id = D.id
                                 ) as completed,
                                 (SELECT cast(count(*) as float)
                                    FROM habit_week_days AS HWD
                                    JOIN habits as H ON H.id = HWD.habit_id 
                                    WHERE 
                                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                                        AND H.created_at <= D.date 
                                 ) as amount
            FROM days AS D
        `

        return summary
    })
}