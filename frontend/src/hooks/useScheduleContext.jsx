import { ScheduleContext } from "../context/scheduleContext";
import { useContext } from 'react'

export const useSchedulesContext = () => {
    const context = useContext(ScheduleContext)

    if(!context){
        throw Error("yes")
    }

    return context
}