import { useContext } from 'react'
import { AdminContext } from '../context/adminContext'


export const useAdminContext = () => {
    const context = useContext(AdminContext)

    if(!context){
        throw Error("yes")
    }

    return context
}