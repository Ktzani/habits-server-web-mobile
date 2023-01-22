import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { ProgressBar } from './ProgressBar';
import dayjs from 'dayjs';
import { HabitsList } from './HabitsList';
import { useState } from 'react';

interface HabitDayProps{
    date: Date
    defaultCompleted?: number  
    amount?: number 
}  

export function HabitDay ({ date, defaultCompleted = 0, amount = 0 }: HabitDayProps){
    const [completed, setCompleted] = useState(defaultCompleted)

    //Gerarei um percentual com base nesses numeros. Então o que eu farei é pegar
    //o total completado / total de habitos disponiveis * 100, 
    const completedPercentage = amount > 0 ? Math.round((completed/amount) * 100.0) : 0
    // if(completedPercentage > 100){
    //   completedPercentage = 100
    // }

    const dayAndMonth = dayjs(date).format("DD/MM")
    const dayOfWeek = dayjs(date).format('dddd')

    //Parametro 'completed': novo numero de habitos completos
    function handleCompletedHabitsChanged(completed: number){
      setCompleted(completed)
    }

    return (
      <Popover.Root>
        <Popover.Trigger 
          type="button" 
          className={clsx('w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-backgroud', {
            'bg-zinc-900 border-zinc-800': completedPercentage === 0,
            'bg-violet-500 border-violet-400': completedPercentage > 0  && completedPercentage < 20,
            'bg-violet-600 border-violet-500': completedPercentage >= 20  && completedPercentage < 40, 
            'bg-violet-700 border-violet-500': completedPercentage >= 40  && completedPercentage < 60, 
            'bg-violet-800 border-violet-600': completedPercentage >= 60  && completedPercentage < 80, 
            'bg-violet-900 border-violet-700': completedPercentage >= 80, 
          })} //Agora vou mudar a cor de fundo do botao/trigger e da borda com base na porcentagem de progresso naquele dia (completedPercentage) 
        />

        <Popover.Portal>
          <Popover.Content className="min-w-[320px] px-7 rounded-2xl bg-zinc-900 flex flex-col"> {/* FlexCol -> elemento um embaixo do outro, em uma coluna*/}
            <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
            <span className=" mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

            <ProgressBar progress={completedPercentage}/>

            <HabitsList date={date} onCompletedChanged={handleCompletedHabitsChanged}/>

            <Popover.Arrow height={8} width={16}  className="fill-zinc-900" /> {/* Usamos fill, pois a arrow nao respeita o background-color*/}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
     )
}