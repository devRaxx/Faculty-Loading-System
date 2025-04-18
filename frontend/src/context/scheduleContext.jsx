import { createContext, useReducer } from "react";

export const ScheduleContext = createContext()

export const semesterScheduleReducer = (state, action) => {
    switch(action.type){
        case 'SET_SCHEDULES':
            return{
                semesterSchedules: action.payload,
                filteredSemesterSchedules: action.payload
            }
        case 'CREATE_SCHEDULE':
            return{
                semesterSchedules: [...action.payload, ...state.semesterSchedules],
                filteredSemesterSchedules : [...action.payload,...state.semesterSchedules]
            }
        case 'UPDATE_SCHEDULE':
                return{
                    semesterSchedules: [...state.semesterSchedules].map(obj =>{
                        if(obj._id == action.payload._id){
                            return action.payload
                        }
                        return obj
                    }),
                    filteredSemesterSchedules: [...state.filteredSemesterSchedules].map(obj =>{
                        if(obj._id == action.payload._id){
                            return action.payload
                        }
                        return obj
                    }),
                }
        case 'FILTER_SCHEDULE_DEPARTMENT':
                return{
                    semesterSchedules: state.semesterSchedules,
                    filteredSemesterSchedules: action.payload.length > 0
                    ? state.semesterSchedules.filter((sched) => action.payload.includes(sched.course.department))
                    : state.semesterSchedules
                    }
        default:
            return state
    }
}

export const ScheduleContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(semesterScheduleReducer, {
        semesterSchedules: [],
        filteredSemesterSchedules: []
    })
    return (
        <ScheduleContext.Provider value={{...state, dispatch}}>
            {children}
        </ScheduleContext.Provider>
    )
}