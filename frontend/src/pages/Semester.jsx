import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import SemNavBar from "../components/NavBar/SemNavBar.jsx";
import { SemesterContextProvider } from "../context/semesterContext.jsx";
import { useSemesterContext } from "../hooks/useSemesterContext.jsx";

const Semester = () => {
    const params = useParams()

    return (
        <div className='flex flex-col h-screen w-screen'>
            <SemesterContextProvider>
                <SemNavBar semId={params.id} />
                <Outlet />
            </SemesterContextProvider>
        </div>
    )
}

export default Semester;