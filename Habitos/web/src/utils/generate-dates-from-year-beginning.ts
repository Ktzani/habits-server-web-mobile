import dayjs from "dayjs";

//Gera todas as datas desde o começo do ano
export function generatedDatesFromYeartBeginnig(){
    const firstDayOfTheYear = dayjs().startOf('year')
    const today = new Date()

    const dates = []
    let compareDate = firstDayOfTheYear

    while (compareDate.isBefore(today)){
        dates.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }

    return dates
}