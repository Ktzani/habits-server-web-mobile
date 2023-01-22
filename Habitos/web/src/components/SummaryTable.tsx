import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generatedDatesFromYeartBeginnig } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

//Datas que irao aparecer na nossa tabela de datas com habitos
const summaryDates = generatedDatesFromYeartBeginnig()

//Minimo de quadradinhos que quero na tabela de habitos
const mimimunSummaryDateSize = 18 * 7 //18 semanas 
const amountDaysToFill = mimimunSummaryDateSize - summaryDates.length //(126 - 19 = 107 quadradinhos inuteis apenas para encaixar na tela)

//Aqui diremos qual o tipo de dados que o estado Summary possui, que é conjunto de dados retornado pela rota 'Summary'
type Summary = Array<{
  id: String;
  date: Date;
  amount: number;
  completed: number;
}>

export function SummaryTable (){
    const [summary, setSummary] = useState<Summary>([])

    //Lembrar: essa rota summary (get) é feita para pegar os registros com os respectivos id das datas, a data em si, 
    //quantidade de habitos daquele dia e quantos foram completos
    useEffect(() => {
      //Usamos um promise, pois é algo que demora
      api.get('/summary').then(response => {
        // console.log(response.data)
        setSummary(response.data)
      })
    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3" >
								{/* //Através disso eu evito de ficar repetindo o mesmo codigo varias vezes no caso: 
								// <div className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
                //    D 
                // </div> 
								//com os diferentes dias da semana */}
								{weekDays.map((weekDay, i) => { 
                  return(
                    <div key={`${weekDay}-${i}`} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
                      {weekDay}
                    </div>
                  )
                })}
            </div>
            
            {/* Através disso retorno os quadradinhos com os resumos dos dias, sendo que se tiver poucos dias no ano ainda,
            eu preencho a tabela com quadradinhos invalidos*/}
						<div className="grid grid-rows-7 grid-flow-col gap-3">
                {/* Quadradinhos dos dias ja passados no ano*/}
								{summary.length > 0 && summaryDates.map( date => {
                  //Verifico se esse dia que estou percorrendo está dentro dos registros do nosso 'resumo' retornado 
                  //pela rota '/Summary', ou seja, se esse dia foi retornado do nosso backend
                  const dayInSummary = summary.find(day => { 
                    return dayjs(date).isSame(day.date, 'day') //Validando se a data que está sendo percorrida desde o dia                                          
                                                               //1 de janeiro é igual a alguma data que está presente dentro 
                                                               //do nosso resumo
                                                               //'day' para indicar que eu quero apenas comparar pelo dia 

                  })

									return ( <HabitDay key={date.toString()} 
                                   date={date} 
                                   amount={dayInSummary?.amount} 
                                   defaultCompleted={dayInSummary?.completed} 
                          /> 
                  )
								})
                }

                {/* Quadradinhos de preenchimento */}
								{amountDaysToFill > 0 && Array.from({ length: amountDaysToFill }).map((_ , i) => {
									return (
										<div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
									)
								})}
						</div>
        </div>
    );
}