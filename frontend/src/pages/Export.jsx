import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { TiExport } from "react-icons/ti";
import { FaRegFileAlt } from "react-icons/fa";
import { FaRegFile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const Export = () => {
  const navigate = useNavigate();
  const [semData, setSemData] = useState(null);
  const [userData, setUserData] = useState({});
  const params = useParams();

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://localhost:4000/api/auth/user", {
          method: "GET",
          credentials: "include",
        });
        const user = await res.json();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://localhost:4000/api/semester", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setSemData(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  const formatSection = (section, courseType, bloc) => {
    console.log(section, courseType, bloc);
    if (courseType === "LAB") {
      return `${section}-${bloc}L`;
    }
    return section;
  };

  const handleExportClick = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/semester/${id}/`, {
        method: "GET",
        credentials: "include",
      });
      const { schedules } = await res.json();

      const headers = [
        "Course Code",
        "Course Description",
        "Class",
        "Section",
        "Time",
        "Day",
        "Rm",
        "Units",
        "Students",
        "FIC",
        "Remarks",
      ];

      const data = schedules.map((schedule) => ({
        "Course Code": schedule.course?.code || "N/A",
        "Course Description": schedule.course?.name || "N/A",
        Class: schedule.course?.type || "N/A",
        Section: schedule.schedule
          .map(({ section }) =>
            formatSection(
              section,
              schedule.course?.type,
              schedule.schedule[0]?.bloc || "1"
            )
          )
          .join(),
        Time: schedule.schedule
          .map(
            (time) => `${time.startTime || "N/A"} - ${time.endTime || "N/A"}`
          )
          .join(", "),
        Day: schedule.schedule
          .map((time) => time.day?.join(", ") || "N/A")
          .join(", "),
        Rm:
          schedule.room && (schedule.room.building || schedule.room.name)
            ? `${schedule.room.building || ""} ${
                schedule.room.name || ""
              }`.trim()
            : "N/A",
        Units: schedule.course?.units || "N/A",
        Students: (schedule.students || [])
          .map(
            (student) =>
              `${student.yearLevel || ""}${student.name || ""}${
                student.bloc ? " Bloc " + student.bloc : ""
              }`.trim() || "N/A"
          )
          .join(", "),
        FIC:
          `${schedule.faculty?.firstName || ""} ${
            schedule.faculty?.lastName || ""
          }`.trim() || "N/A",
        Remarks: schedule.remarks || "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);

      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Semester Data");

      XLSX.writeFile(workbook, "Semester_Data.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <NavBar />
      <div className="flex flex-row justify-center space-x-4 py-7">
        {userData.userType && (
          <>
            <button
              className="flex items-center font-semibold justify-center text-xl border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-32 h-11 transition ease-in duration-200 hover:shadow-custom"
              onClick={() => {
                if (semData?.length) handleExportClick(semData[0]._id);
              }}
            >
              <TiExport /> Export
            </button>
          </>
        )}
      </div>

      <div className="mx-auto w-5/6">
        <table className="w-full border-b">
          <thead className="border-b-2 border-black text-left">
            <tr>
              <th className="flex font-bold text-2xl items-center text-black p-2">
                <FaRegFile />
                Name
              </th>
              <th className="text-black font-bold text-2xl p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {semData ? (
              semData.map((sem) => (
                <tr
                  className="border-b cursor-pointer"
                  key={sem._id}
                  onMouseDown={() => handleExportClick(sem._id)}
                >
                  <td className="flex text-xl font-semibold flex-row items-center text-black p-2">
                    <FaRegFileAlt />
                    {sem.semesterType} Semester {sem.AY}
                  </td>
                  <td className="text-black text-xl font-semibold p-2">
                    <div className="flex flex-col">
                      <p>Summary</p>
                      <p>Faculty</p>
                      <p>Bloc</p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-enamelled-jewel text-2xl text-center font-bold p-2"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Export;
