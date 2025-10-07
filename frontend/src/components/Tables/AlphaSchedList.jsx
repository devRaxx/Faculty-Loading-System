import { useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import EditScheduleModal from "../../modals/EditScheduleModal";
import { useSearchParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { PiCopy } from "react-icons/pi";
import PropTypes from "prop-types";

const AlphaSchedList = ({ editing, searchInput, courseTypeFilter }) => {
  const { semesterSchedules, filteredSemesterSchedules, dispatch, isLoading } =
    useSemesterContext();
  const [queryParameters] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  useEffect(() => {
    (function () {
      dispatch({
        type: "FILTER_SCHEDULE_DEPARTMENT",
        payload: queryParameters.getAll("filter"),
      });
    })();
  }, [queryParameters, dispatch]);

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
    const base = !searchInput
      ? filteredSemesterSchedules
      : filteredSemesterSchedules.filter(({ course, faculty, students }) => {
          const searchLower = searchInput.toLowerCase();
          return (
            course.code.toLowerCase().includes(searchLower) ||
            course.name.toLowerCase().includes(searchLower) ||
            students.some(({ name, bloc, yearLevel }) =>
              `${yearLevel}${name}${bloc ? " - " + bloc : ""}`
                .toLowerCase()
                .includes(searchLower)
            ) ||
            faculty.lastName.toLowerCase().includes(searchLower)
          );
        });

    // If a courseTypeFilter is provided, restrict to that course type (e.g., "LAB")
    if (courseTypeFilter) {
      return base.filter(({ course }) => course.type === courseTypeFilter);
    }

    return base;
  }, [filteredSemesterSchedules, searchInput, courseTypeFilter]);

  AlphaSchedList.propTypes = {
    editing: PropTypes.bool,
    searchInput: PropTypes.string,
    courseTypeFilter: PropTypes.string,
  };

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
            ({ course, faculty, room, schedule, remarks, students, _id }) => {
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
      {!isLoading && (
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
      )}
      {isLoading && (
        <div className="mt-6" role="status" aria-live="polite">
          <div className="w-full mb-4">
            <div className="h-6 bg-placebo-turquoise rounded-md w-1/4 animate-pulse"></div>
          </div>
          <table className="w-full border-separate border-spacing-0">
            <thead className="h-12">
              <tr className="text-lg">
                {Array.from({ length: 11 }).map((_, i) => (
                  <th key={i} className="py-2 px-2">
                    <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, row) => (
                <tr key={row} className="h-12">
                  {Array.from({ length: 11 }).map((_, col) => (
                    <td key={col} className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0 px-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
