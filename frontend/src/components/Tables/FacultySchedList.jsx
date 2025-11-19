import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useDisclosure } from "@chakra-ui/react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { PiCopy } from "react-icons/pi";
import EditFacultyScheduleModal from "../../modals/EditFacultyScheduleModal";

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const hasTimeOverlap = (time1Start, time1End, time2Start, time2End) => {
  const start1 = timeToMinutes(time1Start.replace(/\s*(AM|PM)\s*$/, ""));
  const end1 = timeToMinutes(time1End.replace(/\s*(AM|PM)\s*$/, ""));
  const start2 = timeToMinutes(time2Start.replace(/\s*(AM|PM)\s*$/, ""));
  const end2 = timeToMinutes(time2End.replace(/\s*(AM|PM)\s*$/, ""));

  return start1 < end2 && start2 < end1;
};

const hasCommonDays = (days1, days2) => {
  return days1.some((day1) => days2.includes(day1));
};

const formatSection = (section, courseType, bloc) => {
  if (courseType === "LAB" && section && bloc) {
    return `${section}-${bloc}L`;
  }
  if (courseType !== "LAB" && section && bloc) {
    return `${section} - ${bloc}`;
  }
  return section || "";
};

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
    case "Saturday":
      return "S";
    default:
      return day || "";
  }
};

const hasScheduleConflict = (currentSchedule, allSchedules) => {
  if (!currentSchedule || !Array.isArray(currentSchedule.schedule)) {
    return false;
  }

  for (const otherSchedule of allSchedules) {
    if (
      !otherSchedule ||
      !Array.isArray(otherSchedule.schedule) ||
      currentSchedule._id === otherSchedule._id
    ) {
      continue;
    }

    for (const timeSlot1 of currentSchedule.schedule) {
      if (!timeSlot1 || !Array.isArray(timeSlot1.day)) continue;
      for (const timeSlot2 of otherSchedule.schedule) {
        if (!timeSlot2 || !Array.isArray(timeSlot2.day)) continue;

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
    setIsLoading(true);
    dispatch({
      type: "FILTER_SELECTED_FACULTY_SCHEDULE_DEPARTMENT",
      payload: queryParameters.getAll("filter"),
    });
    setIsLoading(false);
  }, [queryParameters, dispatch]);

  const isHighlighted = (schedule, allSchedules) => {
    if (!schedule) return false;
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
              (schedItem) => {
                if (!schedItem || !schedItem.course) {
                  return null;
                }
                const {
                  course,
                  faculty,
                  room,
                  schedule,
                  remarks,
                  students,
                  _id,
                } = schedItem;

                const scheduleArray = Array.isArray(schedule) ? schedule : [];
                const studentsArray = Array.isArray(students) ? students : [];
                const baseSection = scheduleArray[0]?.section;

                return (
                  <tr
                    className={`h-12 hover:bg-placebo-turquoise ${
                      isHighlighted(
                        {
                          _id,
                          schedule: scheduleArray,
                          remarks,
                        },
                        selectedFacultyFilteredSchedules
                      )
                        ? "bg-[#FF6962]"
                        : ""
                    }`}
                    key={_id}
                    onMouseDown={() => {
                      if (edit) {
                        dispatch({
                          type: "EDIT_FACULTY_SCHEDULE",
                          payload: {
                            _id: _id,
                            course: course,
                            faculty: faculty,
                            room: room,
                            students: studentsArray,
                            remarks: remarks,
                            schedule: scheduleArray,
                          },
                        });
                        onOpen();
                      }
                    }}
                  >
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.code || ""}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.name || ""}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.type || ""}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {studentsArray.length > 0 ? (
                        studentsArray.map((student, index) => (
                          <p key={index}>
                            {formatSection(
                              baseSection,
                              course.type,
                              student.bloc
                            )}
                          </p>
                        ))
                      ) : (
                        <p>{baseSection}</p>
                      )}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {scheduleArray.map((time, index) =>
                        time && time.startTime && time.endTime ? (
                          <p key={index}>{`${time.startTime} - ${time.endTime}`}</p>
                        ) : null
                      )}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {scheduleArray.map((time, index) =>
                        time && Array.isArray(time.day) ? (
                          <p key={index}>
                            {time.day
                              .map((day) => convertDayToAbbreviation(day))
                              .join("")}
                          </p>
                        ) : null
                      )}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {room ? `${room.building || ""} ${room.name || ""}`.trim() : ""}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {course.units || ""}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {studentsArray.map(
                        ({ name, bloc, yearLevel }, index) => (
                          <p key={index}>
                            {`${yearLevel || ""}${name || ""}${
                              bloc ? ` - ${bloc}` : ""
                            }`}
                          </p>
                        )
                      )}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {faculty?.lastName || ""}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0 text-center">
                      {remarks || ""}
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

      {!semesterSchedules?.length > 0 && !isLoading && (
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