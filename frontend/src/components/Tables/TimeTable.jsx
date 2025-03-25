import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { convertToFacultyTimeTableData } from "../../utils/convertDataforTImeTable";

const TimeTable = () => {
  const { selectedFaculty, selectedFacultySchedules } = useSemesterContext();
  const [semScheds, setSemScheds] = useState({});
  const params = useParams();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const formattedData = convertToFacultyTimeTableData(
      selectedFacultySchedules,
      selectedFaculty?._id
    ).reduce((acc, entry) => {
      const { day, ...rest } = entry;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(rest);
      return acc;
    }, {});
    setSemScheds(formattedData);
  }, [params.id, selectedFaculty]);

  const formatSection = (section, courseType, bloc) => {
    if (courseType === "LAB") {
      return `${section}-${bloc}L`;
    }
    return section;
  };

  const generateScheduleRows = () => {
    const timeSlots = [
      "7:00 AM - 7:30 AM",
      "7:30 AM - 8:00 AM",
      "8:00 AM - 8:30 AM",
      "8:30 AM - 9:00 AM",
      "9:00 AM - 9:30 AM",
      "9:30 AM - 10:00 AM",
      "10:00 AM - 10:30 AM",
      "10:30 AM - 11:00 AM",
      "11:00 AM - 11:30 AM",
      "11:30 AM - 12:00 PM",
      "12:00 PM - 12:30 PM",
      "12:30 PM - 1:00 PM",
      "1:00 PM - 1:30 PM",
      "1:30 PM - 2:00 PM",
      "2:00 PM - 2:30 PM",
      "2:30 PM - 3:00 PM",
      "3:00 PM - 3:30 PM",
      "3:30 PM - 4:00 PM",
      "4:00 PM - 4:30 PM",
      "4:30 PM - 5:00 PM",
      "5:00 PM - 5:30 PM",
      "5:30 PM - 6:00 PM",
      "6:00 PM - 6:30 PM",
      "6:30 PM - 7:00 PM",
    ];

    // Find the middle time slot for a given schedule
    const findMiddleTimeSlot = (schedule, allTimeSlots) => {
      const start = new Date(`January 1, 2000 ${schedule.start}`);
      const end = new Date(`January 1, 2000 ${schedule.end}`);

      const matchingSlots = allTimeSlots.filter((slot) => {
        const timeArray = slot.split(" - ");
        const slotStart = new Date(`January 1, 2000 ${timeArray[0]}`);
        const slotEnd = new Date(`January 1, 2000 ${timeArray[1]}`);
        return slotStart >= start && slotEnd <= end;
      });

      const middleIndex = Math.floor(matchingSlots.length / 2);
      return matchingSlots[middleIndex];
    };

    return timeSlots.map((timeSlot, index) => (
      <tr key={index}>
        <td className="border border-enamelled-jewel w-1/8 text-enamelled-jewel text-center">
          {timeSlot.replace(" AM", "").replace(" PM", "")}
        </td>
        {daysOfWeek.map((day, dayIndex) => {
          const matchingSchedules = semScheds[day]
            ? semScheds[day].filter((schedule) => {
                const startTime = schedule.start;
                const endTime = schedule.end;
                const timeArray = timeSlot.split(" - ");
                const timeSlotStart = new Date(
                  `January 1, 2000 ${timeArray[0]}`
                );
                const timeSlotEnd = new Date(`January 1, 2000 ${timeArray[1]}`);
                const start = new Date(`January 1, 2000 ${startTime}`);
                const end = new Date(`January 1, 2000 ${endTime}`);
                return timeSlotStart >= start && timeSlotEnd <= end;
              })
            : [];

          const hasConflict = matchingSchedules.length > 1;

          // Group identical schedules by start-end time
          const scheduleGroups = {};
          matchingSchedules.forEach((schedule) => {
            const key = `${schedule.start}-${schedule.end}`;
            if (!scheduleGroups[key]) {
              scheduleGroups[key] = [];
            }
            scheduleGroups[key].push(schedule);
          });

          const hasIdenticalConflicts = Object.values(scheduleGroups).some(
            (group) => group.length > 1
          );

          return (
            <td
              key={dayIndex}
              className={`w-7/8 ${
                matchingSchedules.length > 0
                  ? ""
                  : "border border-enamelled-jewel text-enamelled-jewel text-center"
              } ${getShadeClass(day, timeSlot, index)}`}
            >
              {matchingSchedules.length > 0 && (
                <>
                  {/* Show conflict message for identical conflicts only in middle time slot */}
                  {hasIdenticalConflicts &&
                    Object.values(scheduleGroups).map((group, groupIndex) => {
                      if (group.length > 1) {
                        const middleTimeSlot = findMiddleTimeSlot(
                          group[0],
                          timeSlots
                        );
                        if (timeSlot === middleTimeSlot) {
                          return (
                            <div key={`conflict-${groupIndex}`}>
                              <p className="flex flex-row items-center justify-center text-white text-center font-regular">
                                CONFLICT <MdErrorOutline />
                              </p>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}

                  {/* Show conflict message for non-identical conflicts */}
                  {hasConflict && !hasIdenticalConflicts && index === 0 && (
                    <div>
                      <p className="flex flex-row items-center justify-center text-white text-center font-regular">
                        CONFLICT <MdErrorOutline />
                      </p>
                    </div>
                  )}

                  {/* Show schedule information */}
                  {matchingSchedules.map((schedule, scheduleIndex) => {
                    // Check if this schedule is part of an identical conflict group
                    const isInIdenticalConflictGroup = Object.values(
                      scheduleGroups
                    ).some(
                      (group) => group.length > 1 && group.includes(schedule)
                    );

                    // Only show subject/section for non-conflict or non-identical conflict schedules
                    if (!hasConflict || !isInIdenticalConflictGroup) {
                      if (!schedule.subjectRendered && scheduleIndex === 0) {
                        schedule.subjectRendered = true;
                        return (
                          <div key={`subject-${scheduleIndex}`}>
                            <p className="text-enamelled-jewel text-center font-extrabold">
                              {schedule.subject}
                            </p>
                          </div>
                        );
                      } else if (
                        !schedule.sectionRendered &&
                        scheduleIndex === 0
                      ) {
                        schedule.sectionRendered = true;
                        return (
                          <div key={`section-${scheduleIndex}`}>
                            <p className="text-enamelled-jewel text-center font-extrabold">
                              {formatSection(
                                schedule.section,
                                schedule.courseType,
                                schedule.bloc
                              )}
                            </p>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  const getShadeClass = (day, timeSlot, rowIndex) => {
    if (!semScheds[day]) return "bg-white";

    const matchingSchedules = semScheds[day].filter((schedule) => {
      const startTime = schedule.start;
      const endTime = schedule.end;
      const timeArray = timeSlot.split(" - ");
      const timeSlotStart = new Date(`January 1, 2000 ${timeArray[0]}`);
      const timeSlotEnd = new Date(`January 1, 2000 ${timeArray[1]}`);
      const start = new Date(`January 1, 2000 ${startTime}`);
      const end = new Date(`January 1, 2000 ${endTime}`);
      return timeSlotStart >= start && timeSlotEnd <= end;
    });

    // Determine if this is the first row of a schedule
    const isFirstRowOfSchedule = () => {
      const timeArray = timeSlot.split(" - ");
      const currentSlotStart = new Date(`January 1, 2000 ${timeArray[0]}`);

      return semScheds[day].some((schedule) => {
        const scheduleStart = new Date(`January 1, 2000 ${schedule.start}`);
        return currentSlotStart.getTime() === scheduleStart.getTime();
      });
    };

    if (matchingSchedules.length === 0) return "bg-white";

    const hasConflicts = matchingSchedules.length > 1;
    const isFirstRow = isFirstRowOfSchedule();

    if (hasConflicts) {
      return `bg-pastel-red ${
        isFirstRow ? "border-t" : ""
      } border-r border-black`;
    } else {
      return `${
        matchingSchedules.length % 2 === 0
          ? "bg-veiling-waterfalls"
          : "bg-placebo-turquoise"
      } ${isFirstRow ? "border-t" : ""} border-r border-black`;
    }
  };

  return (
    <>
      <table className="bg-white text-black w-818 h-729 table-fixed border-b border-r border-black">
        <colgroup>
          <col className="w-1/8" />
          {daysOfWeek.map((day, index) => (
            <col key={index} className="w-7/8" />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-xl font-extrabold w-32">
              Time
            </th>
            {daysOfWeek.map((day, index) => (
              <th
                key={index}
                className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-xl font-extrabold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{generateScheduleRows()}</tbody>
      </table>
    </>
  );
};

export default TimeTable;
