import { useEffect, useMemo, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useDisclosure } from "@chakra-ui/react";
import EditScheduleModal from "../../modals/EditScheduleModal";
import { useParams, useSearchParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { PiCopy } from "react-icons/pi";

const AlphaSchedList = ({ editing, searchInput }) => {
  const {
    semesterSchedules,
    filteredSemesterSchedules,
    editSchedule,
    dispatch,
  } = useSemesterContext();
  const [queryParameters] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  useEffect(() => {
    (function () {
      setIsLoading(true);
      dispatch({
        type: "FILTER_SCHEDULE_DEPARTMENT",
        payload: queryParameters.getAll("filter"),
      });
      setIsLoading(false);
    })();
  }, [queryParameters]);

  // Helper function to format section based on course type
  const formatSection = (section, courseType, bloc) => {
    if (courseType === "LAB") {
      return `${section}-${bloc}L`;
    }
    return section;
  };
  // Helper function to format days
  const formatDays = (days) => {
    if (!days) return "";

    // Handle the special case for Tuesday-Thursday
    if (
      days.includes("Tuesday") &&
      days.includes("Thursday") &&
      days.length === 2
    ) {
      return "TTh";
    }

    // Map for other days
    const dayAbbreviations = {
      Monday: "M",
      Tuesday: "T",
      Wednesday: "W",
      Thursday: "Th",
      Friday: "F",
      Saturday: "S",
      NA: "NA",
    };

    return days.map((day) => dayAbbreviations[day]).join("");
  };

  const filteredSchedules = useMemo(() => {
    if (!searchInput) return filteredSemesterSchedules;
    return filteredSemesterSchedules.filter(
      ({ course, faculty, room, schedule, section, remarks, students }) => {
        const searchLower = searchInput.toLowerCase();
        return (
          // Course Code
          course.code.toLowerCase().includes(searchLower) ||
          // Course Description
          course.name.toLowerCase().includes(searchLower) ||
          // Students
          students.some(({ name, bloc, yearLevel }) =>
            `${yearLevel}${name}${bloc ? " - " + bloc : ""}`
              .toLowerCase()
              .includes(searchLower)
          ) ||
          // FIC (Faculty in Charge)
          faculty.lastName.toLowerCase().includes(searchLower)
        );
      }
    );
  }, [filteredSemesterSchedules, searchInput]);

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const currentSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSchedules.slice(startIndex, endIndex);
  }, [filteredSchedules, currentPage, itemsPerPage]);

  return (
    <>
      <table className="w-full border-separate border-spacing-0">
        <thead className="h-12">
          <tr className="shadow-custom rounded-md text-enamelled-jewel text-lg">
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel rounded-tl-md rounded-bl-md border-r-0">
              Course Code
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Course Description
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Class
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Section
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Time
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Day
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Room
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Units
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              Students
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel border-x-0 ">
              FIC
            </th>
            <th
              className={`bg-placebo-turquoise border border-collapse border-enamelled-jewel border-l-0 ${
                editing
                  ? "border-x-0"
                  : "rounded-tr-md rounded-br-md border-l-0"
              }`}
            >
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {currentSchedules.map(
            ({
              course,
              faculty,
              room,
              schedule,
              section,
              remarks,
              students,
              _id,
            }) => {
              return (
                <tr
                  key={_id}
                  onMouseDown={() => {
                    if (editing) {
                      dispatch({
                        type: "SET_EDIT_SCHEDULE",
                        payload: {
                          _id: _id,
                          course: course,
                          faculty: faculty,
                          room: room,
                          students: students,
                          remarks: remarks,
                          schedule: schedule,
                        },
                      });
                      onOpen();
                    }
                  }}
                  className={`h-12 transition-colors duration-150 ${
                    editing
                      ? "bg-[#eaf9f9] hover:bg-[#d9f2f2]" // Slightly darkened rows while editing
                      : "hover:bg-placebo-turquoise" // Normal hover when not editing
                  }`}
                >
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {course.code}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {course.name}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {course.type}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {schedule.map(({ section }) => {
                      const blocNumber = students[0]?.bloc || "1";
                      return formatSection(section, course.type, blocNumber);
                    })}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {schedule.map((time) => {
                      return (
                        Object.keys(time).length !== 0 && (
                          <p>{time.startTime + " - " + time.endTime}</p>
                        )
                      );
                    })}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {schedule.map((time, index) => {
                      return (
                        <p key={index}>
                          {Object.keys(time).length !== 0 &&
                            formatDays(time.day)}
                        </p>
                      );
                    })}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {room.building + " " + room.name}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {course.units}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {students.map(({ name, bloc, yearLevel }, index) => {
                      return (
                        <p key={index}>
                          {yearLevel + name + `${bloc ? " - " + bloc : ""}`}
                        </p>
                      );
                    })}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {faculty.lastName}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {remarks}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="bg-placebo-turquoise text-enamelled-jewel border border-enamelled-jewel rounded-md px-4 py-2 transition ease-in duration-200 hover:shadow-custom disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-placebo-turquoise text-enamelled-jewel border border-enamelled-jewel rounded-md px-4 py-2 transition ease-in duration-200 hover:shadow-custom disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-enamelled-jewel">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-placebo-turquoise text-enamelled-jewel border border-enamelled-jewel rounded-md px-4 py-2 transition ease-in duration-200 hover:shadow-custom disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="bg-placebo-turquoise text-enamelled-jewel border border-enamelled-jewel rounded-md px-4 py-2 transition ease-in duration-200 hover:shadow-custom disabled:opacity-50"
        >
          Last
        </button>
      </div>
      {isLoading && (
        <div className="mt-24">
          <p className="text-8xl font-bold">Loading ...</p>
        </div>
      )}
      {!isLoading &&
        (!semesterSchedules.length || !filteredSemesterSchedules.length) && (
          <div className="mt-24 flex flex-col items-center justify-center">
            <p className="text-7xl font-bold text-enamelled-jewel">
              Start Adding the List
            </p>
            <p className="text-3xl p-2 font-light italic text-enamelled-jewel">
              or
            </p>
            <button className="flex items-center justify-center w-96 h-20 border text-xl font-semibold text-enamelled-jewel border-enamelled-jewel rounded-md bg-placebo-turquoise transition ease-in duration-200 hover:shadow-custom">
              <PiCopy /> Copy Alpha List
            </button>
          </div>
        )}
      {isOpen && <EditScheduleModal onClose={onClose} isOpen={isOpen} />}
    </>
  );
};

export default AlphaSchedList;
