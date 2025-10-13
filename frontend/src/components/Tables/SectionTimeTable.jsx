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

    const isFirstRowOfSchedule = () => {
      const timeArray = timeSlot.split(" - ");
      const currentSlotStart = new Date(`January 1, 2000 ${timeArray[0]}`);

      return semScheds[day].some((schedule) => {
        const scheduleStart = new Date(`January 1, 2000 ${schedule.start}`);
        return currentSlotStart.getTime() === scheduleStart.getTime();
      });
    };

    const hasConflicts = matchingSchedules.length > 1;
    const isFirstRow = isFirstRowOfSchedule();

    if (hasConflicts) {
      return `bg-pastel-red ${
        isFirstRow ? "border-t" : ""
      } border-r border-black`;
    }

    return `${
      matchingSchedules.length % 2 === 0
        ? "bg-veiling-waterfalls"
        : "bg-placebo-turquoise"
    } ${isFirstRow ? "border-t" : ""} border-r border-black`;
  };

  return (
    <div>
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

                const allSchedulesForDay = semScheds[day] || [];
                const placements = allSchedulesForDay.map((schedule) => {
                  const middle = findMiddleTimeSlot(schedule, timeSlots);
                  const middleIndex = timeSlots.indexOf(middle);
                  let displayIndex = 0;
                  if (middleIndex !== -1)
                    displayIndex = Math.max(0, middleIndex - 1);
                  const displaySlot = timeSlots[displayIndex];

                  let facultySlot = null;
                  if (displayIndex + 1 < timeSlots.length) {
                    const nextSlot = timeSlots[displayIndex + 1];
                    const timeArrayNext = nextSlot.split(" - ");
                    const nsStart = new Date(
                      `January 1, 2000 ${timeArrayNext[0]}`
                    );
                    const nsEnd = new Date(
                      `January 1, 2000 ${timeArrayNext[1]}`
                    );
                    const start = new Date(`January 1, 2000 ${schedule.start}`);
                    const end = new Date(`January 1, 2000 ${schedule.end}`);
                    if (nsStart >= start && nsEnd <= end)
                      facultySlot = nextSlot;
                  }
                  return { ...schedule, middle: displaySlot, facultySlot };
                });

                const hasIdenticalConflicts = Object.values(
                  scheduleGroups
                ).some((g) => g.length > 1);

                return (
                  <td
                    key={dayIndex}
                    className={`${
                      matchingSchedules.length > 0
                        ? ""
                        : "border border-enamelled-jewel text-enamelled-jewel text-center"
                    } ${getShadeClass(day, timeSlot)} align-middle`}
                  >
                    {hasIdenticalConflicts &&
                      Object.values(scheduleGroups).map((group, groupIndex) => {
                        if (group.length > 1) {
                          const middleTimeSlot = findMiddleTimeSlot(
                            group[0],
                            timeSlots
                          );
                          if (timeSlot === middleTimeSlot) {
                            return (
                              <div
                                key={`conflict-${groupIndex}`}
                                className="flex items-center justify-center h-full"
                              >
                                <p className="flex items-center gap-1 text-white text-center font-regular">
                                  CONFLICT <MdErrorOutline />
                                </p>
                              </div>
                            );
                          }
                        }
                        return null;
                      })}

                    {matchingSchedules.length > 1 &&
                      !hasIdenticalConflicts &&
                      (() => {
                        const timeArray = timeSlot.split(" - ");
                        const currentSlotStart = new Date(
                          `January 1, 2000 ${timeArray[0]}`
                        );
                        const isFirstRow = semScheds[day].some((schedule) => {
                          const scheduleStart = new Date(
                            `January 1, 2000 ${schedule.start}`
                          );
                          return (
                            currentSlotStart.getTime() ===
                            scheduleStart.getTime()
                          );
                        });

                        return isFirstRow ? (
                          <div className="flex items-center justify-center h-full">
                            <p className="flex items-center gap-1 text-white text-center font-regular">
                              CONFLICT <MdErrorOutline />
                            </p>
                          </div>
                        ) : null;
                      })()}

                    {placements.map((p, pi) => {
                      const key = `${p.start}-${p.end}`;
                      const group =
                        (scheduleGroups && scheduleGroups[key]) || [];
                      const isIdentical = group.length > 1;

                      if (!isIdentical && p.middle === timeSlot) {
                        return (
                          <div
                            key={`sub-${pi}`}
                            className="flex items-center justify-center h-full"
                          >
                            <p className="text-enamelled-jewel text-center font-extrabold">
                              {p.subject}
                            </p>
                          </div>
                        );
                      }

                      if (!isIdentical && p.facultySlot === timeSlot) {
                        return (
                          <div
                            key={`fac-${pi}`}
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
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <h3 className="text-red-500 font-extrabold mb-2">Conflicts</h3>
        <ConflictsTable
          semScheds={semScheds}
          timeSlots={timeSlots}
          daysOfWeek={daysOfWeek}
        />
      </div>
    </div>
  );
};

export default SectionTimeTable;

SectionTimeTable.propTypes = {
  schedules: PropTypes.array,
};

const ConflictsTable = ({ semScheds, daysOfWeek }) => {
  const conflicts = [];

  daysOfWeek.forEach((day) => {
    const schedules = semScheds[day] || [];
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        const a = schedules[i];
        const b = schedules[j];
        const aStart = new Date(`January 1, 2000 ${a.start}`).getTime();
        const aEnd = new Date(`January 1, 2000 ${a.end}`).getTime();
        const bStart = new Date(`January 1, 2000 ${b.start}`).getTime();
        const bEnd = new Date(`January 1, 2000 ${b.end}`).getTime();

        if (aStart < bEnd && bStart < aEnd) {
          conflicts.push({ day, a, b });
        }
      }
    }
  });

  if (conflicts.length === 0) {
    return <div className="text-sm text-gray-600">No conflicts detected.</div>;
  }

  return (
    <div className="overflow-auto max-h-64 border border-enamelled-jewel">
      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-red-500 text-white">
            <th className="px-2 py-1">Day</th>
            <th className="px-2 py-1">Time A</th>
            <th className="px-2 py-1">Subject A</th>
            <th className="px-2 py-1">Faculty A</th>
            <th className="px-2 py-1">Time B</th>
            <th className="px-2 py-1">Subject B</th>
            <th className="px-2 py-1">Faculty B</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.map((c, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-gray-50">
              <td className="px-2 py-1 align-top">{c.day}</td>
              <td className="px-2 py-1 align-top">{`${c.a.start} - ${c.a.end}`}</td>
              <td className="px-2 py-1 align-top">{c.a.subject}</td>
              <td className="px-2 py-1 align-top">{c.a.facultyLastName}</td>
              <td className="px-2 py-1 align-top">{`${c.b.start} - ${c.b.end}`}</td>
              <td className="px-2 py-1 align-top">{c.b.subject}</td>
              <td className="px-2 py-1 align-top">{c.b.facultyLastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ConflictsTable.propTypes = {
  semScheds: PropTypes.object,
  daysOfWeek: PropTypes.array,
};
