import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { convertToSectionTimeTableData } from "../../utils/convertDataforTImeTable";
import PropTypes from "prop-types";

// Helper function outside the component
const timeToDate = (timeStr) => new Date(`January 1, 2000 ${timeStr}`);

const SectionTimeTable = ({ schedules, conflicts, coTeaching }) => {
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
    "7:00 AM - 7:30 AM", "7:30 AM - 8:00 AM", "8:00 AM - 8:30 AM",
    "8:30 AM - 9:00 AM", "9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM", "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM", "12:00 PM - 12:30 PM", "12:30 PM - 1:00 PM",
    "1:00 PM - 1:30 PM", "1:30 PM - 2:00 PM", "2:00 PM - 2:30 PM",
    "2:30 PM - 3:00 PM", "3:00 PM - 3:30 PM", "3:30 PM - 4:00 PM",
    "4:00 PM - 4:30 PM", "4:30 PM - 5:00 PM", "5:00 PM - 5:30 PM",
    "5:30 PM - 6:00 PM", "6:00 PM - 6:30 PM", "6:30 PM - 7:00 PM",
  ];

  const findDisplayTimeSlot = (schedule, allTimeSlots) => {
    const start = timeToDate(schedule.start);
    const end = timeToDate(schedule.end);

    const matchingSlots = allTimeSlots.filter((slot) => {
      const timeArray = slot.split(" - ");
      const slotStart = timeToDate(timeArray[0]);
      const slotEnd = timeToDate(timeArray[1]);
      return slotStart < end && slotEnd > start;
    });

    if (matchingSlots.length === 0) return null;

    const displayIndex = Math.floor(matchingSlots.length / 3);
    return matchingSlots[displayIndex];
  };

  // Helper function to check overlap between a timeslot string and start/end times
  const timeSlotOverlaps = (timeSlot, startStr, endStr) => {
    const timeArray = timeSlot.split(" - ");
    const slotStart = timeToDate(timeArray[0]).getTime();
    const slotEnd = timeToDate(timeArray[1]).getTime();
    const start = timeToDate(startStr).getTime();
    const end = timeToDate(endStr).getTime();
    return slotStart < end && slotEnd > start;
  };

  // --- REVISED getShadeAndBorderClass ---
  const getShadeAndBorderClass = (day, timeSlot) => {
    const baseClasses = "border-enamelled-jewel align-middle p-0 text-xs overflow-hidden whitespace-nowrap text-center"; // Base classes for all cells
    let shadeClass = "bg-white"; // Default background
    let borderClasses = "border-l border-b"; // Default borders for empty cells

    if (!semScheds[day]) return `${baseClasses} ${shadeClass} ${borderClasses}`;

    const overlappingSchedules = semScheds[day].filter((schedule) =>
      timeSlotOverlaps(timeSlot, schedule.start, schedule.end)
    );

    if (overlappingSchedules.length === 0) {
      return `${baseClasses} ${shadeClass} ${borderClasses}`;
    }

    // Determine if this is the first or last time slot within ANY overlapping schedule
    const timeArray = timeSlot.split(" - ");
    const currentSlotStart = timeToDate(timeArray[0]);
    const currentSlotEnd = timeToDate(timeArray[1]);

    const isFirstSlot = overlappingSchedules.some(schedule =>
      currentSlotStart.getTime() === timeToDate(schedule.start).getTime()
    );

    const isLastSlot = overlappingSchedules.some(schedule =>
      currentSlotEnd.getTime() === timeToDate(schedule.end).getTime()
    );

    // Determine conflict/co-teaching status for coloring
    const isConflictSlot = conflicts.some(c =>
      c.day === day &&
      (timeSlotOverlaps(timeSlot, c.a.start, c.a.end) || timeSlotOverlaps(timeSlot, c.b.start, c.b.end))
    );

    const isCoTeachingSlot = coTeaching.some(ct =>
      ct.day === day && timeSlotOverlaps(timeSlot, ct.a.start, ct.a.end)
    );

    // Determine shade based on precedence
    if (isConflictSlot) {
      shadeClass = "bg-pastel-red";
    } else if (isCoTeachingSlot) {
      shadeClass = "bg-blue-200";
    } else {
      shadeClass = "bg-placebo-turquoise";
    }

    // Determine borders for schedule blocks
    borderClasses = "border-l border-r"; // Left and Right borders are always needed for columns
    if (isFirstSlot) {
        borderClasses += " border-t"; // Add top border only if it's the first slot
    }
    if (isLastSlot) {
        borderClasses += " border-b"; // Add bottom border only if it's the last slot
    }


    return `${baseClasses} ${shadeClass} ${borderClasses}`;
  };
  // --- END REVISED ---


  const conflictsExist = conflicts && conflicts.length > 0;
  const coTeachingExists = coTeaching && coTeaching.length > 0;

  return (
    <div>
      <table className="bg-white text-black w-[818px] table-fixed border-collapse"> {/* Use border-collapse */}
        <colgroup>
          <col className="w-[12.5%]" />
          {daysOfWeek.map((_, index) => (
            <col key={index} className="w-[14.58%]" />
          ))}
        </colgroup>
        <thead>
          <tr className="h-[40px]">
            <th className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-xl font-extrabold">
              Time
            </th>
            {daysOfWeek.map((day, index) => (
              <th
                key={index}
                className="border-b-2 border-l border-enamelled-jewel text-enamelled-jewel text-lg font-extrabold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, index) => (
            <tr key={index} className="h-[28px]">
              <td className="border border-enamelled-jewel text-enamelled-jewel text-center text-xs px-0 py-0 align-middle">
                {timeSlot.replace(" AM", "").replace(" PM", "")}
              </td>
              {daysOfWeek.map((day, dayIndex) => {
                const overlappingSchedules = (semScheds[day] || []).filter(schedule =>
                  timeSlotOverlaps(timeSlot, schedule.start, schedule.end)
                );

                let cellContent = null;
                if (overlappingSchedules.length > 0) {
                    const conflictInSlot = conflicts.find(c =>
                        c.day === day &&
                        (timeSlotOverlaps(timeSlot, c.a.start, c.a.end) || timeSlotOverlaps(timeSlot, c.b.start, c.b.end))
                    );

                    const coTeachingInSlot = coTeaching.find(ct =>
                        ct.day === day && timeSlotOverlaps(timeSlot, ct.a.start, ct.a.end)
                    );

                    // --- Determine Display Slot ---
                    // Prioritize conflict display slot, then co-teaching, then regular
                    let displayScheduleForSlot = overlappingSchedules[0]; // Default
                    if (conflictInSlot) displayScheduleForSlot = conflictInSlot.a;
                    else if (coTeachingInSlot) displayScheduleForSlot = coTeachingInSlot.a;

                    const displaySlot = findDisplayTimeSlot(displayScheduleForSlot, timeSlots);
                    const displaySlotIndex = timeSlots.indexOf(displaySlot);
                    // Determine faculty display slot - slightly below the main display slot
                    const facultyDisplayIndex = displaySlotIndex !== -1 ? displaySlotIndex + 1 : -1;
                    const facultyDisplaySlot = facultyDisplayIndex !== -1 && facultyDisplayIndex < timeSlots.length ? timeSlots[facultyDisplayIndex] : null;


                    // --- Render Content based on type and slot ---
                    if (conflictInSlot && timeSlot === displaySlot) {
                        cellContent = (
                            <div key="conflict-display" className="flex items-center justify-center h-full text-white text-xs px-0 py-0">
                                CONFLICT <MdErrorOutline size="1em" className="ml-1"/>
                            </div>
                        );
                    } else if (coTeachingInSlot && timeSlot === displaySlot) {
                        cellContent = (
                            <div key="co-teach-display" className="flex flex-col items-center justify-center h-full text-blue-800 text-xs px-0 py-0 leading-tight">
                                <span className="font-semibold flex items-center">
                                  CO-TEACH <FaChalkboardTeacher size="1em" className="ml-1"/>
                                </span>
                                <span className="font-bold">{coTeachingInSlot.a.subject}</span>
                            </div>
                        );
                    } else if (!conflictInSlot && !coTeachingInSlot) {
                        // Regular schedule display
                        const schedule = overlappingSchedules[0]; // Only display info for the first one if multiple non-conflicting overlaps (rare)

                        if (timeSlot === displaySlot) {
                            cellContent = (
                                <div key="sub-display" className="flex items-center justify-center h-full text-enamelled-jewel text-xs px-0 py-0 font-bold leading-tight">
                                    {schedule.subject}
                                </div>
                            );
                        } else if (timeSlot === facultyDisplaySlot && schedule.facultyLastName) {
                             cellContent = (
                                <div key="fac-display" className="flex items-center justify-center h-full text-enamelled-jewel text-xs px-0 py-0 font-semibold leading-tight">
                                    {schedule.facultyLastName}
                                </div>
                            );
                        }
                    }
                }

                return (
                  <td
                    key={dayIndex}
                    // --- Use the combined class function ---
                    className={getShadeAndBorderClass(day, timeSlot)}
                  >
                   {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render CoTeachingTable */}
      {coTeachingExists && (
        <div className="mt-6">
          <h3 className="text-blue-600 font-extrabold mb-2">
            Co-Teaching Assignments
          </h3>
          <CoTeachingTable coTeaching={coTeaching} />
        </div>
      )}

      {/* Render ConflictsTable */}
      {conflictsExist && (
        <div className="mt-6">
          <h3 className="text-red-500 font-extrabold mb-2">Conflicts</h3>
          <ConflictsTable conflicts={conflicts} />
        </div>
      )}
    </div>
  );
};

// --- PropTypes and Sub-components remain the same ---
SectionTimeTable.propTypes = {
  schedules: PropTypes.array,
  conflicts: PropTypes.array,
  coTeaching: PropTypes.array,
};

const ConflictsTable = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }
  return (
    <div className="overflow-auto max-h-64 border border-enamelled-jewel">
      <table className="min-w-full text-left text-sm">
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
  conflicts: PropTypes.array.isRequired,
};

const CoTeachingTable = ({ coTeaching }) => {
  if (!coTeaching || coTeaching.length === 0) {
    return null;
  }
  const coTeachingGroups = {};
  coTeaching.forEach(({ day, a, b }) => {
    const key = `${day}-${a.subject}-${a.start}`;
    if (!coTeachingGroups[key]) {
      coTeachingGroups[key] = {
        day: day,
        time: `${a.start} - ${a.end}`,
        subject: a.subject,
        faculties: new Set([a.facultyLastName, b.facultyLastName]),
      };
    } else {
      coTeachingGroups[key].faculties.add(a.facultyLastName);
      coTeachingGroups[key].faculties.add(b.facultyLastName);
    }
  });

  return (
    <div className="overflow-auto max-h-64 border border-enamelled-jewel">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-2 py-1">Day</th>
            <th className="px-2 py-1">Time</th>
            <th className="px-2 py-1">Subject</th>
            <th className="px-2 py-1">Faculties</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(coTeachingGroups).map((c, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-gray-50">
              <td className="px-2 py-1 align-top">{c.day}</td>
              <td className="px-2 py-1 align-top">{c.time}</td>
              <td className="px-2 py-1 align-top">{c.subject}</td>
              <td className="px-2 py-1 align-top">
                {Array.from(c.faculties).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

CoTeachingTable.propTypes = {
  coTeaching: PropTypes.array.isRequired,
};


export default SectionTimeTable;