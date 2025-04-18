import { createContext, useReducer } from "react";

export const FacultyContext = createContext()

export const facultyScheduleReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FACULTY_SCHEDULES':
            return {
                facultySchedules: action.payload,
                filteredFacultySchedules: state.filteredFacultySchedules,
                selectedFaculty : state.selectedFaculty,
                edit : state.edit,
                editData : state.editData
            }
        case 'CREATE_FACULTY_SCHEDULE':
            return {
                facultySchedules: [...action.payload, ...state.facultySchedules],
                filteredFacultySchedules: [...action.payload, ...state.facultySchedules],
                selectedFaculty : state.selectedFaculty,
                edit : state.edit,
                editData : state.editData
            }
        case 'UPDATE_FACULTY_SCHEDULE':
            return {
                facultySchedules: [...state.facultySchedules].map(obj => {
                    if (obj._id == action.payload._id) {
                        return action.payload
                    }
                    return obj
                }),
                filteredFacultySchedules: [...state.filteredFacultySchedules].map(obj => {
                    if (obj._id == action.payload._id) {
                        return action.payload
                    }
                    return obj
                }),
                selectedFaculty : state.selectedFaculty,
                edit : state.edit,
                editData : state.editData
            }
        case 'SELECT_FACULTY':
            console.log("this happened \n", action.payload)
            return {
                facultySchedules: state.facultySchedules,
                filteredFacultySchedules: action.query && action.query.length > 0 && action.payload.schedules.length > 0 
                    ? action.payload.schedules.filter((sched) => action.query.includes(sched.course.department))
                    : action.payload.schedules,
                selectedFaculty : action.payload,
                edit : state.edit,
                editData : state.editData
            }
        case 'EDIT_FACULTY_SCHEDULE':
            return {
                ...state,
                editData: action.payload
            }
        case 'FILTER_FACULTY_SCHEDULE_DEPARTMENT':
            return {
                facultySchedules: state.facultySchedules,
                filteredFacultySchedules: state.filteredFacultySchedules && action.payload.length > 0 && state.filteredFacultySchedules.length > 0
                    ? state.selectedFaculty.schedules.filter((sched) => action.payload.includes(sched.course.department))
                    : state.selectedFaculty.schedules,
                selectedFaculty : state.selectedFaculty,
                edit : state.edit,
                editData : state.editData
            }
        case 'SET_EDIT':
            return {
                ...state,
                edit : !(state.edit),
                editData: null
            }

        default:
            return state
    }
}

export const FacultyContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(facultyScheduleReducer, {
        facultySchedules: [],
        filteredFacultySchedules: [],
        selectedFaculty: "",
        edit: false,
        editData: null
    })
    return (
        <FacultyContext.Provider value={{ ...state, dispatch }}>
            {children}
        </FacultyContext.Provider>
    )
}