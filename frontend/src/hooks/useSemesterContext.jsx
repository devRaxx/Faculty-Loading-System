import { useContext } from 'react'
import { SemesterContext } from "../context/semesterContext";

export const useSemesterContext = () => {
    const context = useContext(SemesterContext)

    if(!context){
        throw Error("yes")
    }

    return context
}