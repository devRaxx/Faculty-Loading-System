import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { convertToBlocTimeTableData } from "../../utils/convertDataforBlocTable";

const BlocTable = () => {
  const { selectedFaculty } = useSemesterContext(); // selectedFaculty = selectedBloc
  const [semScheds, setSemScheds] = useState({});
  const params = useParams();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const fetchBlocSchedule = async () => {
      if (!selectedFaculty) return;

      const query = new URLSearchParams({
        yearLevel: selectedFaculty.yearLevel,
        department: selectedFaculty.department,
        bloc: selectedFaculty.bloc,
      }).toString();

      const res = await fetch(
        `https://faculty-loading-system.vercel.app/api/bloc/${params.id}?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      const formattedData = convertToBlocTimeTableData(
        data,
        selectedFaculty.name
      ).reduce((acc, entry) => {
        const { day, ...rest } = entry;
        if (!acc[day]) acc[day] = [];
        acc[day].push(rest);
        return acc;
      }, {});

      setSemScheds(formattedData);
    };

    fetchBlocSchedule();
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

    const findMiddleTimeSlot = (schedule, allTimeSlots) => {
      const start = new Date(`January 1, 2000 ${schedule.start}`);
      const end = new Date(`January 1, 2000 ${schedule.end}`);
      const matchingSlots = allTimeSlots.filter((slot) => {
        const [slotStartStr, slotEndStr] = slot.split(" - ");
        const slotStart = new Date(`January 1, 2000 ${slotStartStr}`);
        const slotEnd = new Date(`January 1, 2000 ${slotEndStr}`);
        return slotStart >= start && slotEnd <= end;
      });
      return matchingSlots[Math.floor(matchingSlots.length / 2)];
    };

    return timeSlots.map((timeSlot, index) => (
      <tr key={index}>
        <td className="border border-enamelled-jewel w-1/8 text-enamelled-jewel text-center">
          {timeSlot.replace(" AM", "").replace(" PM", "")}
        </td>
        {daysOfWeek.map((day, dayIndex) => {
          const matchingSchedules =
            semScheds[day]?.filter((schedule) => {
              const [slotStartStr, slotEndStr] = timeSlot.split(" - ");
              const timeSlotStart = new Date(`January 1, 2000 ${slotStartStr}`);
              const timeSlotEnd = new Date(`January 1, 2000 ${slotEndStr}`);
              const start = new Date(`January 1, 2000 ${schedule.start}`);
              const end = new Date(`January 1, 2000 ${schedule.end}`);
              return timeSlotStart >= start && timeSlotEnd <= end;
            }) || [];

          const hasConflict = matchingSchedules.length > 1;

          const scheduleGroups = {};
          matchingSchedules.forEach((s) => {
            const key = `${s.start}-${s.end}`;
            if (!scheduleGroups[key]) scheduleGroups[key] = [];
            scheduleGroups[key].push(s);
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
              } ${getShadeClass(day, timeSlot)}`}
            >
              {matchingSchedules.length > 0 && (
                <>
                  {hasIdenticalConflicts &&
                    Object.values(scheduleGroups).map((group, groupIndex) => {
                      const middleTimeSlot = findMiddleTimeSlot(
                        group[0],
                        timeSlots
                      );
                      return timeSlot === middleTimeSlot ? (
                        <div key={`conflict-${groupIndex}`}>
                          <p className="flex flex-row items-center justify-center text-white text-center font-regular">
                            CONFLICT <MdErrorOutline />
                          </p>
                        </div>
                      ) : null;
                    })}

                  {hasConflict && !hasIdenticalConflicts && index === 0 && (
                    <div>
                      <p className="flex flex-row items-center justify-center text-white text-center font-regular">
                        CONFLICT <MdErrorOutline />
                      </p>
                    </div>
                  )}

                  {matchingSchedules.map((s, idx) => {
                    const isInConflictGroup = Object.values(
                      scheduleGroups
                    ).some((group) => group.length > 1 && group.includes(s));

                    if (!hasConflict || !isInConflictGroup) {
                      if (!s.subjectRendered && idx === 0) {
                        s.subjectRendered = true;
                        return (
                          <div key={`subject-${idx}`}>
                            <p className="text-enamelled-jewel text-center font-extrabold">
                              {s.subject}
                            </p>
                          </div>
                        );
                      } else if (!s.sectionRendered && idx === 0) {
                        s.sectionRendered = true;
                        return (
                          <div key={`section-${idx}`}>
                            <p className="text-enamelled-jewel text-center font-extrabold">
                              {formatSection(s.section, s.courseType, s.bloc)}
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

  const getShadeClass = (day, timeSlot) => {
    if (!semScheds[day]) return "bg-white";

    const matching = semScheds[day].filter((schedule) => {
      const [slotStartStr, slotEndStr] = timeSlot.split(" - ");
      const timeSlotStart = new Date(`January 1, 2000 ${slotStartStr}`);
      const timeSlotEnd = new Date(`January 1, 2000 ${slotEndStr}`);
      const start = new Date(`January 1, 2000 ${schedule.start}`);
      const end = new Date(`January 1, 2000 ${schedule.end}`);
      return timeSlotStart >= start && timeSlotEnd <= end;
    });

    if (matching.length === 0) return "bg-white";

    const isFirstRow = matching.some((s) => {
      const scheduleStart = new Date(`January 1, 2000 ${s.start}`);
      const currentSlotStart = new Date(
        `January 1, 2000 ${timeSlot.split(" - ")[0]}`
      );
      return scheduleStart.getTime() === currentSlotStart.getTime();
    });

    return matching.length > 1
      ? `bg-pastel-red ${isFirstRow ? "border-t" : ""} border-r border-black`
      : `${
          matching.length % 2 === 0
            ? "bg-veiling-waterfalls"
            : "bg-placebo-turquoise"
        } ${isFirstRow ? "border-t" : ""} border-r border-black`;
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
              className="border-b-2 border-enamelled-jewel text-enamelled-jewel text-xl font-extrabold"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{generateScheduleRows()}</tbody>
    </table>
  );
};

export default BlocTable;
