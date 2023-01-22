import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
    date: Date;
    onCompletedChanged: (completed: number) => void //função que nao tem retorno, porém tem um parametro 
}

interface HabitsInfo {
    possibleHabits: Array<{
        id: string;
        title: string; 
        created_at: string;
    }>,
    completedHabits: string[]//Aqui retornamos apenas os id´s dos habitos completos naquele dia
}

export function HabitsList({ date, onCompletedChanged }: HabitsListProps){
    const [habitsInformations, setHabitsInformations] = useState<HabitsInfo>()

    // LEMBRAR: Para fazermos o getDayInfo do backend, para pegar as informaçoes do que tem de habito naquele dia 
    //especifico precisamos passsar a data para a rota. Por isso mesmo que pegamos a data que tinhamos passado no 
    //componente habitDay
    useEffect(() =>{
        api.get('/dayInfo', {
            params: { //Tudo que eu passar aqui dentro será convertido para QueryParams, exatamente como faziamos no Insominia
                date: date.toISOString(), 
            }
        }).then(response => {
            setHabitsInformations(response.data)
        })
    }, []) 

    //Ver anotaçoes para entender isso
    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    async function handleToogleHabit(habitId: string) {
        await api.patch(`/habits/${habitId}/toggle`)

        const isHabitAlreadyCompleted = habitsInformations!.completedHabits.includes(habitId)
        
        let completedHabits: string [] = []
        if (isHabitAlreadyCompleted){
            //Tiramos um dos elementos da lista ao dar unchecked nele, filtrando isso apenas com habitos que nao tenham o 
            //id do habito que foi retirado da lista
            completedHabits = habitsInformations!.completedHabits.filter(id => id !== habitId) 
        }
        else{
            completedHabits = [...habitsInformations!.completedHabits, habitId]
        }

        //Como alteramos apenas o completedHabits, precisamos repassar o valor do possibleHabits sem alterá-lo
        setHabitsInformations({
            possibleHabits: habitsInformations!.possibleHabits,
            completedHabits
        })

        //Passamos aqui para essa função o tamanho da lista de completedHabits alterada com mais ou menos habitos completos
        //e essa função que está em habitDay agora faz o habitDay tambem saber o que foi alterado dos habitos completos, ou 
        //seja, toda vez que essa lista mudar dentro do handleToogleHabit, ele vai avisar o componente pai que a lista mudou
        onCompletedChanged(completedHabits.length) 
    }

    return(
        <div className="mt-6 flex flex-col gap-3">
            {habitsInformations?.possibleHabits.map( habit => {
                return (
                    <Checkbox.Root 
                        key={habit.id}
                        onCheckedChange={() => handleToogleHabit(habit.id)}
                        //Quando o id dos possíveis habitos está dentro da lista dos habitos completos, 
                        //quer dizer que ele foi completado e por isso colocamos checked nele
                        checked={habitsInformations.completedHabits.includes(habit.id)} 
                        disabled={isDateInPast}
                        className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                    >
                        {/* Fazemos essa div para aparecer um quadradinho mesmo quando nao tiver checkado o indicator*/}
                        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-backgroud'>
                            <Checkbox.Indicator> 
                                <Check size={20} className="text-white font-bold"/>
                            </Checkbox.Indicator> 
                        </div>
                    
                        <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400 '>
                            {habit.title}
                        </span>

                    </Checkbox.Root>                    
                );
            })}
            
        </div>
    );
}