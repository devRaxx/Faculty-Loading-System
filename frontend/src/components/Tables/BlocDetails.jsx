import { useFacultyContext } from "../../hooks/useFacultyContext"
import { useSemesterContext } from "../../hooks/useSemesterContext"
const BlocDetails = () => {
    const { selectedFaculty, selectedFacultySchedules, dispatch } = useSemesterContext()
    return (
        <div>
            <table className="w-full border-2 border-enamelled-jewel">
                <thead>
                    <tr className="bg-enamelled-jewel h-10 border-2 border-enamelled-jewel">
                        <th className="font-bold text-white text-2xl">
                            {selectedFaculty ? selectedFaculty.lastName : "Bloc"}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-2 border-enamelled-jewel h-10">
                        <td>
                            <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                                <p>TLC</p>
                                <p>{selectedFacultySchedules && selectedFacultySchedules.length > 0
                                    ? selectedFacultySchedules.reduce(
                                        (totalUnits, sched) => totalUnits + sched.course.units,
                                        0
                                    )
                                    : "0"}
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr className="border-2 border-enamelled-jewel h-10">
                        <td>
                            <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                                <p>ALC</p>
                                <p>{selectedFaculty ? selectedFaculty.ALC : "0"}</p>
                            </div>
                        </td>
                    </tr>
                    <tr className="border-2 border-enamelled-jewel h-10">
                        <td>
                            <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                                <p>SLC</p>
                                <p>{selectedFaculty ? selectedFaculty.SLC : "0"}</p>
                            </div>
                        </td>
                    </tr>
                    <tr className="border-2 border-enamelled-jewel h-10">
                        <td>
                            <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                                <p>RLC</p>
                                <p>{selectedFaculty ? selectedFaculty.RLC : "0"}</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="pt-5 flex justify-between items-center">
                <p className="text-2xl font-bold inline text-enamelled-jewel">
                    Total Units: {selectedFaculty 
                        ? selectedFacultySchedules.reduce((totalUnits, sched) => totalUnits + sched.course.units,0 ) 
                        + selectedFaculty.ALC
                        + selectedFaculty.SLC 
                        + selectedFaculty.RLC 
                        : "0"}
                </p>
                <button onClick={()=>{dispatch({type: 'SET_EDIT'})}} className="inline border-2 rounded-none text-enamelled-jewel border-enamelled-jewel text-2xl px-6 transition ease-in duration-200 hover:shadow-custom">Edit</button>
            </div>
        </div>
    )
}

export default BlocDetails;