import { FacultyContext } from "../context/facultyScheduleContext";
import { useContext } from 'react'

export const useFacultyContext = () => {
    const context = useContext(FacultyContext)

    if(!context){
        throw Error("yes")
    }

    return context
}