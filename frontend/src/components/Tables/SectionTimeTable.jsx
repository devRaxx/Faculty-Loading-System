import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { convertToSectionTimeTableData } from "../../utils/convertDataforTImeTable";
import PropTypes from "prop-types";

const SectionTimeTable = ({ schedules }) => {
  const [semScheds, setSemScheds] = useState({});
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const formattedData = convertToSectionTimeTableData(schedules).reduce(
      (acc, entry) => {
        const { day, ...rest } = entry;
        if (!acc[day]) acc[day] = [];
        acc[day].push(rest);
        return acc;
      },
      {}
    );
    setSemScheds(formattedData);
  }, [schedules]);

  // SectionTimeTable shows subject and FIC for the selected section; section-formatting not needed here.

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

    return `${
      matchingSchedules.length % 2 === 0
        ? "bg-veiling-waterfalls"
        : "bg-placebo-turquoise"
    } border-r border-black`;
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
          <th className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-xl font-extrabold w-32">
            Time
          </th>
          {daysOfWeek.map((day, index) => (
            <th
              key={index}
              className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-lg font-extrabold"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot, index) => (
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
                    const timeSlotEnd = new Date(
                      `January 1, 2000 ${timeArray[1]}`
                    );
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

              // Compute placement for each schedule on the day: which slot shows the subject (middle)
              // and which slot (if any) should show the faculty (we try the slot immediately after middle)
              const allSchedulesForDay = semScheds[day] || [];
              const placements = allSchedulesForDay.map((schedule) => {
                // Find original middle index, then shift display one slot earlier
                const middle = findMiddleTimeSlot(schedule, timeSlots);
                const middleIndex = timeSlots.indexOf(middle);
                // Default to first slot when middle not found
                let displayIndex = 0;
                if (middleIndex !== -1)
                  displayIndex = Math.max(0, middleIndex - 1);
                const displaySlot = timeSlots[displayIndex];

                let facultySlot = null;
                // Try to place faculty in the slot immediately after the displaySlot (which becomes the previous middle)
                if (displayIndex + 1 < timeSlots.length) {
                  const nextSlot = timeSlots[displayIndex + 1];
                  // Verify the next slot is still within the schedule range
                  const timeArrayNext = nextSlot.split(" - ");
                  const nsStart = new Date(
                    `January 1, 2000 ${timeArrayNext[0]}`
                  );
                  const nsEnd = new Date(`January 1, 2000 ${timeArrayNext[1]}`);
                  const start = new Date(`January 1, 2000 ${schedule.start}`);
                  const end = new Date(`January 1, 2000 ${schedule.end}`);
                  if (nsStart >= start && nsEnd <= end) facultySlot = nextSlot;
                }
                return { ...schedule, middle: displaySlot, facultySlot };
              });

              const hasIdenticalConflicts = Object.values(scheduleGroups).some(
                (g) => g.length > 1
              );

              return (
                <td
                  key={dayIndex}
                  className={`${
                    matchingSchedules.length > 0
                      ? ""
                      : "border border-enamelled-jewel text-enamelled-jewel text-center"
                  } ${getShadeClass(day, timeSlot)} align-middle`}
                >
                  {matchingSchedules.length > 0 && (
                    <>
                      {/* Identical conflicts: show CONFLICT only in the middle time slot */}
                      {hasIdenticalConflicts &&
                        Object.values(scheduleGroups).map((group, gi) => {
                          if (group.length > 1) {
                            const middle = findMiddleTimeSlot(
                              group[0],
                              timeSlots
                            );
                            if (timeSlot === middle) {
                              return (
                                <div
                                  key={`conflict-${gi}`}
                                  className="flex items-center justify-center h-full"
                                >
                                  <p className="flex flex-row items-center justify-center text-white text-center font-regular">
                                    CONFLICT <MdErrorOutline />
                                  </p>
                                </div>
                              );
                            }
                          }
                          return null;
                        })}

                      {/* For normal schedules render subject + FIC only in the middle timeslot so it appears centered in shaded region */}
                      {/* Render subjects in their middle slot, and render faculty names in the next slot when possible */}
                      {placements.map((p) => {
                        if (p.middle === timeSlot) {
                          return (
                            <div
                              key={`sub-${p.subject}-${p.start}-${p.end}`}
                              className="flex items-center justify-center h-full"
                            >
                              <p className="text-enamelled-jewel text-center font-extrabold">
                                {p.subject}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })}

                      {placements.map((p) => {
                        if (p.facultySlot === timeSlot) {
                          return (
                            <div
                              key={`fac-${p.subject}-${p.start}-${p.end}`}
                              className="flex items-center justify-center h-full"
                            >
                              <p className="text-enamelled-jewel text-center font-semibold">
                                {p.facultyLastName}
                              </p>
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
