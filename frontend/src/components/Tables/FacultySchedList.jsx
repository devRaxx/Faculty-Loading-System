import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useDisclosure } from "@chakra-ui/react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { PiCopy } from "react-icons/pi";
import EditFacultyScheduleModal from "../../modals/EditFacultyScheduleModal";

// Helper function to convert time string to minutes for easier comparison
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Check if two time ranges overlap
const hasTimeOverlap = (time1Start, time1End, time2Start, time2End) => {
  const start1 = timeToMinutes(time1Start.replace(/\s*(AM|PM)\s*$/, ""));
  const end1 = timeToMinutes(time1End.replace(/\s*(AM|PM)\s*$/, ""));
  const start2 = timeToMinutes(time2Start.replace(/\s*(AM|PM)\s*$/, ""));
  const end2 = timeToMinutes(time2End.replace(/\s*(AM|PM)\s*$/, ""));

  return start1 < end2 && start2 < end1;
};

// Check if two schedules have conflicting days
const hasCommonDays = (days1, days2) => {
  return days1.some((day1) => days2.includes(day1));
};

// Helper function to format section based on course type
const formatSection = (section, courseType, bloc) => {
  if (courseType === "LAB") {
    return `${section}-${bloc}L`;
  }
  return section;
};

// Helper function to convert day names to abbreviations
const convertDayToAbbreviation = (day) => {
  switch (day) {
    case "Monday":
      return "M";
    case "Tuesday":
      return "T";
    case "Wednesday":
      return "W";
    case "Thursday":
      return "Th";
    case "Friday":
      return "F";
    default:
      return day;
  }
};

// Main function to check for schedule conflicts
const hasScheduleConflict = (currentSchedule, allSchedules) => {
  for (const otherSchedule of allSchedules) {
    // Skip comparing with itself
    if (currentSchedule._id === otherSchedule._id) continue;

    // Check each time slot combination
    for (const timeSlot1 of currentSchedule.schedule) {
      for (const timeSlot2 of otherSchedule.schedule) {
        // Check if days overlap and times conflict
        if (
          hasCommonDays(timeSlot1.day, timeSlot2.day) &&
          hasTimeOverlap(
            timeSlot1.startTime,
            timeSlot1.endTime,
            timeSlot2.startTime,
            timeSlot2.endTime
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const FacultySchedList = ({ edit }) => {
  const {
    semesterSchedules,
    selectedFacultySchedules,
    selectedFacultyFilteredSchedules,
    dispatch,
  } = useSemesterContext();
  const [queryParameters] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const params = useParams();

  useEffect(() => {
    (function () {
      setIsLoading(true);
      dispatch({
        type: "FILTER_SELECTED_FACULTY_SCHEDULE_DEPARTMENT",
        payload: queryParameters.getAll("filter"),
      });
      setIsLoading(false);
    })();
  }, [queryParameters, dispatch]);

  // Function to determine if the row should have a specific background color
  const isHighlighted = (schedule, allSchedules) => {
    return (
      (schedule.remarks && schedule.remarks.toLowerCase().includes("urgent")) ||
      hasScheduleConflict(schedule, allSchedules)
    );
  };

  return (
    <>
      <table className="w-5/6 border-separate border-spacing-0">
        <thead className="h-12">
          <tr className="shadow-custom rounded-md text-lg">
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel rounded-tl-md rounded-bl-md border-r-0">
              Course Code
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Course Description
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Class
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Section
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Time
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Day
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Room
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Units
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              Students
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0">
              FIC
            </th>
            <th
              className={`bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel ${
                edit ? "border-x-0" : "rounded-tr-md rounded-br-md border-l-0"
              }`}
            >
              Remarks
            </th>
            {edit && (
              <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel rounded-tr-md rounded-br-md border-l-0">
                Delete
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {selectedFacultyFilteredSchedules &&
            selectedFacultyFilteredSchedules.length > 0 &&
            selectedFacultyFilteredSchedules.map(
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
                    className={`h-12 hover:bg-placebo-turquoise ${
                      isHighlighted(
                        {
                          _id,
                          schedule,
                          remarks,
                        },
                        selectedFacultyFilteredSchedules
                      )
                        ? "bg-[#FF6962]"
                        : ""
                    }`}
                    key={_id}
                    onMouseDown={() => {
                      edit &&
                        (dispatch({
                          type: "EDIT_FACULTY_SCHEDULE",
                          payload: {
                            _id: _id,
                            course: course,
                            faculty: faculty,
                            room: room,
                            students: students,
                            remarks: remarks,
                            schedule: schedule,
                          },
                        }),
                        onOpen());
                    }}
                  >
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.code}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.name}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.type}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {schedule.map(({ section }) => {
                        const blocNumber = students[0]?.bloc || "1";
                        return formatSection(section, course.type, blocNumber);
                      })}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {schedule.map(
                        (time) =>
                          Object.keys(time).length !== 0 && (
                            <p>{time.startTime + " - " + time.endTime}</p>
                          )
                      )}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {schedule.map((time, index) => (
                        <p key={index}>
                          {Object.keys(time).length !== 0 &&
                            time.day
                              .map((day) => convertDayToAbbreviation(day))
                              .join("")}
                        </p>
                      ))}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {room.building + " " + room.name}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.units}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {students.map(({ name, bloc, yearLevel }, index) => (
                        <p key={index}>
                          {yearLevel + name + `${bloc ? " - " + bloc : ""}`}
                        </p>
                      ))}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {faculty.lastName}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {remarks}
                    </td>
                    {edit && (
                      <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                        <IoTrashOutline />
                      </td>
                    )}
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

      {!semesterSchedules.length > 0 && !isLoading && (
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

      {selectedFacultyFilteredSchedules &&
        selectedFacultyFilteredSchedules.length === 0 &&
        !isLoading && (
          <div className="mt-24 flex flex-col items-center justify-center">
            <p className="text-7xl font-bold text-enamelled-jewel">
              Please select a faculty
            </p>
          </div>
        )}

      {edit && (
        <EditFacultyScheduleModal
          semester={params.id}
          onClose={onClose}
          isOpen={isOpen}
        />
      )}
    </>
  );
};

export default FacultySchedList;
