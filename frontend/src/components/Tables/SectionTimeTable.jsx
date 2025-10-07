import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { convertToSectionTimeTableData } from "../../utils/convertDataforTImeTable";
import PropTypes from "prop-types";

const SectionTimeTable = ({ schedules }) => {
  const [semScheds, setSemScheds] = useState({});
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const formattedData = convertToSectionTimeTableData(schedules).reduce((acc, entry) => {
      const { day, ...rest } = entry;
      if (!acc[day]) acc[day] = [];
      acc[day].push(rest);
      return acc;
    }, {});
    setSemScheds(formattedData);
  }, [schedules]);

  // SectionTimeTable shows subject and FIC for the selected section; section-formatting not needed here.

  const timeSlots = [
    "7:00 AM - 7:30 AM","7:30 AM - 8:00 AM","8:00 AM - 8:30 AM","8:30 AM - 9:00 AM","9:00 AM - 9:30 AM","9:30 AM - 10:00 AM","10:00 AM - 10:30 AM","10:30 AM - 11:00 AM","11:00 AM - 11:30 AM","11:30 AM - 12:00 PM","12:00 PM - 12:30 PM","12:30 PM - 1:00 PM","1:00 PM - 1:30 PM","1:30 PM - 2:00 PM","2:00 PM - 2:30 PM","2:30 PM - 3:00 PM","3:00 PM - 3:30 PM","3:30 PM - 4:00 PM","4:00 PM - 4:30 PM","4:30 PM - 5:00 PM","5:00 PM - 5:30 PM","5:30 PM - 6:00 PM","6:00 PM - 6:30 PM","6:30 PM - 7:00 PM",
  ];

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

  // formatDays isn't used here (kept in TimeTable component).

  const getShadeClass = (day, timeSlot) => {
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

    if (matchingSchedules.length === 0) return "bg-white";

    return `${matchingSchedules.length % 2 === 0 ? "bg-veiling-waterfalls" : "bg-placebo-turquoise"} border-r border-black`;
  };

  return (
    <table className="bg-white text-black w-818 h-729 table-fixed border-b border-r border-black">
      <colgroup>
        <col className="w-1/8" />
        {daysOfWeek.map((day, index) => (
          <col key={index} className="w-7/8" />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-xl font-extrabold w-32">Time</th>
          {daysOfWeek.map((day, index) => (
            <th key={index} className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-lg font-extrabold">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot, index) => (
          <tr key={index}>
            <td className="border border-enamelled-jewel w-1/8 text-enamelled-jewel text-center">{timeSlot.replace(" AM", "").replace(" PM", "")}</td>
            {daysOfWeek.map((day, dayIndex) => {
              const matchingSchedules = semScheds[day]
                ? semScheds[day].filter((schedule) => {
                    const startTime = schedule.start;
                    const endTime = schedule.end;
                    const timeArray = timeSlot.split(" - ");
                    const timeSlotStart = new Date(`January 1, 2000 ${timeArray[0]}`);
                    const timeSlotEnd = new Date(`January 1, 2000 ${timeArray[1]}`);
                    const start = new Date(`January 1, 2000 ${startTime}`);
                    const end = new Date(`January 1, 2000 ${endTime}`);
                    return timeSlotStart >= start && timeSlotEnd <= end;
                  })
                : [];

              const scheduleGroups = {};
              matchingSchedules.forEach((schedule) => {
                const key = `${schedule.start}-${schedule.end}`;
                if (!scheduleGroups[key]) scheduleGroups[key] = [];
                scheduleGroups[key].push(schedule);
              });

              const hasIdenticalConflicts = Object.values(scheduleGroups).some((g) => g.length > 1);

              return (
                <td key={dayIndex} className={`${matchingSchedules.length > 0 ? "" : "border border-enamelled-jewel text-enamelled-jewel text-center"} ${getShadeClass(day, timeSlot)}`}>
                  {matchingSchedules.length > 0 && (
                    <>
                      {hasIdenticalConflicts && Object.values(scheduleGroups).map((group, gi) => {
                        if (group.length > 1) {
                          const middle = findMiddleTimeSlot(group[0], timeSlots);
                          if (timeSlot === middle) {
                            return (
                              <div key={`conflict-${gi}`}>
                                <p className="flex flex-row items-center justify-center text-white text-center font-regular">CONFLICT <MdErrorOutline /></p>
                              </div>
                            );
                          }
                        }
                        return null;
                      })}

                      {matchingSchedules.map((schedule, si) => {
                        // Use flags to render subject once per schedule duration and show FIC (faculty last name)
                        if (!schedule.subjectRendered && si === 0) {
                          schedule.subjectRendered = true;
                          return (
                            <div key={`subject-${si}`}>
                              <p className="text-enamelled-jewel text-center font-extrabold">{schedule.subject}</p>
                            </div>
                          );
                        }

                        if (!schedule.ficRendered && si === 0) {
                          schedule.ficRendered = true;
                          return (
                            <div key={`fic-${si}`}>
                              <p className="text-enamelled-jewel text-center font-extrabold">{schedule.facultyLastName}</p>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SectionTimeTable;

SectionTimeTable.propTypes = {
  schedules: PropTypes.array,
};
