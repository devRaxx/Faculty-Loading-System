import React, { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { convertToFacultyTimeTableData } from "../../utils/convertDataforTImeTable";

const timeToDate = (timeStr) => new Date(`January 1, 2000 ${timeStr}`);

const timeSlotOverlaps = (timeSlot, startStr, endStr) => {
  const timeArray = timeSlot.split(" - ");
  const slotStart = timeToDate(timeArray[0]).getTime();
  const slotEnd = timeToDate(timeArray[1]).getTime();
  const start = timeToDate(startStr).getTime();
  const end = timeToDate(endStr).getTime();
  return slotStart < end && slotEnd > start;
};

const TimeTable = () => {
  const { selectedFaculty, selectedFacultySchedules } = useSemesterContext();
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
  }, [selectedFaculty, selectedFacultySchedules]); 

  const formatSection = (section, courseType, bloc) => {
    if (courseType === "LAB") {
      return `${section}-${bloc}L`;
    }
    return section;
  };

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

  const getShadeAndBorderClass = (day, timeSlot) => {
    const baseClasses = "border-enamelled-jewel align-middle p-0 text-xs overflow-hidden whitespace-nowrap text-center";
    let shadeClass = "bg-white";
    let borderClasses = "border-l border-b"; 

    if (!semScheds[day]) return `${baseClasses} ${shadeClass} ${borderClasses}`;

    const overlappingSchedules = semScheds[day].filter((schedule) =>
      timeSlotOverlaps(timeSlot, schedule.start, schedule.end)
    );

    if (overlappingSchedules.length === 0) {
      return `${baseClasses} ${shadeClass} ${borderClasses}`;
    }

    const timeArray = timeSlot.split(" - ");
    const currentSlotStart = timeToDate(timeArray[0]);
    const currentSlotEnd = timeToDate(timeArray[1]);

    const isFirstSlot = overlappingSchedules.some(schedule =>
      currentSlotStart.getTime() === timeToDate(schedule.start).getTime()
    );

    const isLastSlot = overlappingSchedules.some(schedule =>
      currentSlotEnd.getTime() === timeToDate(schedule.end).getTime()
    );

    const hasConflict = overlappingSchedules.length > 1;
    if (hasConflict) {
      shadeClass = "bg-pastel-red";
    } else {
      const schedule = overlappingSchedules[0];
      shadeClass = schedule.subject.length % 2 === 0 ? "bg-placebo-turquoise" : "bg-veiling-waterfalls";
    }

    borderClasses = "border-l border-r"; 
    if (isFirstSlot) {
        borderClasses += " border-t"; 
    }
    if (isLastSlot) {
        borderClasses += " border-b"; 
    }

    return `${baseClasses} ${shadeClass} ${borderClasses}`;
  };

  return (
    <>
      <table className="bg-white text-black w-[818px] table-fixed border-collapse">
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
                  const hasConflict = overlappingSchedules.length > 1;
                  const schedule = overlappingSchedules[0];

                  const displaySlot = findDisplayTimeSlot(schedule, timeSlots);
                  const displaySlotIndex = timeSlots.indexOf(displaySlot);
                  const sectionDisplaySlot = (displaySlotIndex !== -1 && (displaySlotIndex + 1) < timeSlots.length)
                    ? timeSlots[displaySlotIndex + 1]
                    : null;
                  
                  if (hasConflict && timeSlot === displaySlot) {
                    cellContent = (
                      <div key="conflict-display" className="flex items-center justify-center h-full text-white text-xs px-0 py-0">
                        CONFLICT <MdErrorOutline size="1em" className="ml-1"/>
                      </div>
                    );
                  } else if (!hasConflict) {
                    if (timeSlot === displaySlot) {
                      cellContent = (
                        <div key="sub-display" className="flex items-center justify-center h-full text-enamelled-jewel text-xs px-0 py-0 font-bold leading-tight">
                            {schedule.subject}
                        </div>
                      );
                    } 
                    else if (timeSlot === sectionDisplaySlot) {
                      cellContent = (
                        <div key="sec-display" className="flex items-center justify-center h-full text-enamelled-jewel text-xs px-0 py-0 font-semibold leading-tight">
                           {formatSection(
                              schedule.section,
                              schedule.courseType,
                              schedule.bloc
                            )}
                        </div>
                      );
                    }
                  }
                }
                
                return (
                  <td
                    key={dayIndex}
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

    </>
  );
};

export default TimeTable;