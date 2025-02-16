import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { convertToBlocTimeTableData } from "../../utils/convertDataforBlocTable";

const BlocTable = () => {
  const { selectedBloc, selectedBlocSchedules } = useSemesterContext();
  const [semScheds, setSemScheds] = useState({});
  const params = useParams();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    if (
      !selectedBloc ||
      !selectedBlocSchedules ||
      selectedBlocSchedules.length === 0
    ) {
      setSemScheds({});
      return;
    }

    const formattedData = convertToBlocTimeTableData(
      selectedBlocSchedules,
      selectedBloc._id
    ).reduce((acc, entry) => {
      const { day, ...rest } = entry;
      if (!acc[day]) acc[day] = [];
      acc[day].push(rest);
      return acc;
    }, {});

    console.log("Formatted Bloc Schedule Data:", formattedData);
    setSemScheds(formattedData);
  }, [params.id, selectedBloc]);

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

  const generateScheduleRows = () => {
    return timeSlots.map((timeSlot, index) => (
      <tr key={index}>
        <td className="border border-enamelled-jewel w-1/8 text-enamelled-jewel text-center">
          {timeSlot.replace(" AM", "").replace(" PM", "")}
        </td>
        {daysOfWeek.map((day, dayIndex) => {
          const matchingSchedules = semScheds[day]?.filter((schedule) => {
            const startTime = schedule.start;
            const endTime = schedule.end;
            const timeArray = timeSlot.split(" - ");

            const timeSlotStart = new Date(`January 1, 2000 ${timeArray[0]}`);
            const timeSlotEnd = new Date(`January 1, 2000 ${timeArray[1]}`);
            const start = new Date(`January 1, 2000 ${startTime}`);
            const end = new Date(`January 1, 2000 ${endTime}`);

            return timeSlotStart >= start && timeSlotEnd <= end;
          });

          // Identify conflicts only when different subjects overlap
          const uniqueSubjects = new Map();
          matchingSchedules?.forEach((s) => {
            if (!uniqueSubjects.has(s.subject)) {
              uniqueSubjects.set(s.subject, s);
            }
          });

          const hasConflict = uniqueSubjects.size > 1;

          return (
            <td
              key={dayIndex}
              className={`w-7/8 border border-enamelled-jewel text-center ${
                hasConflict ? "bg-pastel-red" : ""
              }`}
            >
              {matchingSchedules?.map((schedule, idx) => (
                <p
                  key={idx}
                  className="text-enamelled-jewel text-center font-extrabold"
                >
                  {schedule.subject}
                </p>
              ))}
              {hasConflict && (
                <p className="flex flex-row items-center justify-center text-white font-regular">
                  CONFLICT <MdErrorOutline />
                </p>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <table className="bg-white text-black w-818 h-729 table-fixed border-b border-r border-black">
      <thead>
        <tr>
          <th>Time</th>
          {daysOfWeek.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>{generateScheduleRows()}</tbody>
    </table>
  );
};

export default BlocTable;
