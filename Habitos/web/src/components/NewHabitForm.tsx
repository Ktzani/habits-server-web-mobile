import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChangeEvent, FormEvent, useState } from "react";
import { api } from "../lib/axios";

const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'

]

export function NewHabitForm () {
    //Usando ESTADOS para pegar os valores dos dados no formulario
    // Usamos '' pois pegaremos string e o setTitle é para alterar o valor dessa variavel/estado
    const [title, setTitle] = useState('') 
    const [weekDays, setWeekDays] = useState<number[]>([]) 

    // Lembrar: Sempre o 'form' do html tem por padrão enviar o usuario para outra pagina. Por isso ele tem o 
    // method e o action (como vi no curso pra node que estava fazendo). 
    // - Para evitar que isso aconteça, o que podemos fazer é receber o evento (que no caso é o evento de submit)
    //   com o seu tipo do react FormEvent e colocar a funcao preventDefault. Agora nosso formulario nao faz mais o 
    //   redirecionamento do usuário 
    async function createNewHabit(event: FormEvent){
        event.preventDefault()
        
        //Nesse caso o formulario não faz nada
        if(!title || weekDays.length === 0){
            return
        }

        await api.post('/habits', {
            title,
            weekDays
        })

        //Ao completar a ação de criar habito, eu 'zero' todos os valores naquele form
        setTitle('') 
        setWeekDays([])

        alert('Hábito criado com sucesso!!')
    }

    //Crio essa função, pois o checked ele funciona pra tanto quando vou adicionar, como remover o check da lista. Logo
    //Eu vou ter que lidar tanto com adicionar o array de dias da semana como tambem remover do array caso aquilo ja 
    //estiver la
    function handleToggleWeekDay(weekDay: number){
        if(weekDays.includes(weekDay)){
            const weekDayWithRemovedOne = weekDays.filter(day => day !== weekDay) 

            setWeekDays(weekDayWithRemovedOne)
        } 
        else {
            const weekDaysWithAddedOne = [...weekDays, weekDay] 

            setWeekDays(weekDaysWithAddedOne)
        }
    }

    return(
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input 
                type="text" 
                id="title" 
                placeholder="Ex.: Exercicios, dormir bem, etc..." 
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                autoFocus 
                value={title}
                onChange={event => setTitle(event.target.value)} //Isso aqui nos retorna o valor do input, ou seja
                                                                 //toda vez que o usuário digitar qualquer coisa nesse 
                                                                 //input ele vai anotando na variavel 'title' do nosso estado
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            <div className="flex flex-col gap-2 mt-3">
                {/* O index do map pegara os dias da semana exatos numericamente */}
                {availableWeekDays.map( (weekDay, index) => {
                    return(
                        <Checkbox.Root 
                            key={weekDay} 
                            className='flex items-center gap-3 group focus:outline-none'
                            checked={weekDays.includes(index)} //Faz com que o checked apareça checked somente se aquele dia da semana estiver no array de dias da semana
                            onCheckedChange={() => handleToggleWeekDay(index)} //O que será executado quando o usario trocar o check do checkbox
                        >
                            {/* Fazemos essa div para aparecer um quadradinho mesmo quando nao tiver checkado o indicator*/}
                            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900'>
                                <Checkbox.Indicator> 
                                    <Check size={20} className="text-white"/>
                                </Checkbox.Indicator> 
                            </div>
                        
                            <span className='text-white leading-tight'>
                                {weekDay}
                            </span>
                        </Checkbox.Root>                        
                    )
                })}
            </div>

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900">
                <Check  size={20} weight="bold" />
                Confirmar
            </button>
        </form>   
    );
}