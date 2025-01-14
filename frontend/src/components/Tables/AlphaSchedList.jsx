import { useEffect, useMemo, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import AddScheduleModal from "../../modals/AddScheduleModal";
import { useDisclosure } from "@chakra-ui/react";
import EditScheduleModal from "../../modals/EditScheduleModal";
import { useParams, useSearchParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import TestModal from "../../modals/testModal";
import { PiCopy } from "react-icons/pi";

const AlphaSchedList = ({ editing }) => {
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
      NA: "NA",
    };

    return days.map((day) => dayAbbreviations[day]).join("");
  };

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
            {editing && (
              <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel rounded-tr-md rounded-br-md border-l-0">
                Delete
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredSemesterSchedules &&
            filteredSemesterSchedules.length > 0 &&
            filteredSemesterSchedules.map(
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
                    className="h-12 hover:bg-placebo-turquoise"
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
                    <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                      {editing && <IoTrashOutline />}
                    </td>
                  </tr>
                );
              }
            )}
        </tbody>
      </table>
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
