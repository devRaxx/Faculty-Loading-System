import { createContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

export const SemesterContext = createContext();

export const semesterReducer = (state, action) => {
  console.log("Action Dispatched:", action);

  switch (action.type) {
    case "SET_SEMESTER":
      return {
        ...state,
        semesterSchedules: action.payload.schedules || [],
        filteredSemesterSchedules: action.payload.schedules || [],
        semesterCourses: action.payload.courses || [],
        semesterRooms: action.payload.rooms || [],
        semesterFaculties: action.payload.faculties || [],
        semesterBlocs: action.payload.blocs || [],
        semesterDegreePrograms: action.payload.degreePrograms || [],
      };

    case "SELECT_BLOC":
      if (!action.payload || !action.payload._id) {
        console.error(
          "SELECT_BLOC Error: Invalid bloc payload",
          action.payload
        );
        return { ...state, selectedBloc: null, selectedBlocSchedules: [] }; // Prevent crash
      }
      return {
        ...state,
        selectedBloc: action.payload,
        selectedBlocSchedules: state.semesterSchedules.filter(
          (sched) => sched.bloc && sched.bloc._id === action.payload._id
        ),
      };

    case "SELECT_FACULTY":
      if (!action.payload || !action.payload._id) {
        console.error(
          "SELECT_FACULTY Error: Invalid faculty payload",
          action.payload
        );
        return {
          ...state,
          selectedFaculty: null,
          selectedFacultySchedules: [],
        };
      }
      return {
        ...state,
        selectedFacultySchedules: state.semesterSchedules.filter(
          (sched) => sched.faculty && sched.faculty._id === action.payload._id
        ),
        selectedFacultyFilteredSchedules: state.semesterSchedules.filter(
          (sched) => sched.faculty && sched.faculty._id === action.payload._id
        ),
        selectedFaculty: action.payload,
      };

    case "CREATE_SCHEDULE":
      return {
        ...state,
        semesterSchedules: [...action.payload, ...state.semesterSchedules],
        filteredSemesterSchedules: [
          ...action.payload,
          ...state.semesterSchedules,
        ],
      };

    case "CREATE_COURSE":
      return {
        ...state,
        semesterCourses: [action.payload, ...state.semesterCourses],
      };

    case "CREATE_ROOM":
      return {
        ...state,
        semesterRooms: [action.payload, ...state.semesterRooms],
      };

    case "CREATE_FACULTY":
      return {
        ...state,
        semesterFaculties: [action.payload, ...state.semesterFaculties],
      };

    case "CREATE_BLOCS":
      return {
        ...state,
        semesterBlocs: [action.payload, ...state.semesterBlocs],
      };

    case "CREATE_DEGREE_PROGRAM":
      return {
        ...state,
        semesterDegreePrograms: [
          action.payload,
          ...state.semesterDegreePrograms,
        ],
      };

    case "UPDATE_SCHEDULE":
      return {
        ...state,
        semesterSchedules: state.semesterSchedules.map((obj) =>
          obj._id === action.payload._id ? action.payload : obj
        ),
        filteredSemesterSchedules: state.filteredSemesterSchedules.map((obj) =>
          obj._id === action.payload._id ? action.payload : obj
        ),
      };

    case "UPDATE_FACULTY":
      return {
        ...state,
        semesterFaculties: state.semesterFaculties.map((obj) =>
          obj._id === action.payload._id ? action.payload : obj
        ),
        selectedFaculty: action.payload,
      };

    case "SET_EDIT_SCHEDULE":
      return {
        ...state,
        editSchedule: action.payload,
      };

    case "FILTER_SELECTED_FACULTY_SCHEDULE_DEPARTMENT":
      return {
        ...state,
        selectedFacultyFilteredSchedules:
          action.payload.length > 0
            ? state.selectedFacultySchedules.filter((sched) =>
                action.payload.includes(sched.course.department)
              )
            : state.selectedFacultySchedules,
      };

    case "FILTER_SCHEDULE_DEPARTMENT":
      return {
        ...state,
        filteredSemesterSchedules:
          action.payload.length > 0
            ? state.semesterSchedules.filter((sched) =>
                action.payload.includes(sched.course.department)
              )
            : state.semesterSchedules,
      };

    case "START_LOADING":
      return {
        ...state,
        isLoading: true,
      };

    case "END_LOADING":
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

export const SemesterContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(semesterReducer, {
    semesterSchedules: [],
    filteredSemesterSchedules: [],
    semesterCourses: [],
    semesterRooms: [],
    semesterFaculties: [],
    semesterBlocs: [],
    semesterDegreePrograms: [],
    editSchedule: {},

    selectedFacultyFilteredSchedules: [],
    selectedFacultySchedules: [],
    selectedFaculty: null,

    selectedBlocSchedules: [],
    selectedBloc: null,

    isLoading: false,
  });

  console.log("Current State:", state);

  const params = useParams();

  useEffect(() => {
    (async function fetchSemesterData() {
      try {
        dispatch({ type: "START_LOADING" });

        const res = await fetch(
          `https://faculty-loading-system.vercel.app/api/semester/${params.id}/`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch semester data: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched Semester Data:", data);

        dispatch({ type: "SET_SEMESTER", payload: data });
      } catch (error) {
        console.error("Error loading semester data:", error);
      } finally {
        dispatch({ type: "END_LOADING" });
      }
    })();
  }, [params.id]);

  return (
    <SemesterContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SemesterContext.Provider>
  );
};
