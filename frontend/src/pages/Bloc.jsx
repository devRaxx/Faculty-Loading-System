import { useState } from "react";
import SectionSearch from "../components/Filters/SectionSearch";
import SectionTimeTable from "../components/Tables/SectionTimeTable";
import { convertToSectionTimeTableData } from "../utils/convertDataforTImeTable";
import { useSemesterContext } from "../hooks/useSemesterContext";

const Bloc = () => {
  const [selectedSectionDisplay, setSelectedSectionDisplay] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const { isLoading } = useSemesterContext();

  const handleSelect = (display, schedules) => {
    setSelectedSectionDisplay(display);
    setSelectedSchedules(schedules || []);
  };

  const hasConflicts = () => {
    if (!selectedSchedules || selectedSchedules.length === 0) return false;

    // Flatten schedules by day using the same converter the timetable uses
    const flat = convertToSectionTimeTableData(selectedSchedules);
    if (!flat || flat.length === 0) return false;

    const byDay = flat.reduce((acc, s) => {
      if (!acc[s.day]) acc[s.day] = [];
      acc[s.day].push(s);
      return acc;
    }, {});

    for (const day in byDay) {
      const arr = byDay[day];
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const a = arr[i];
          const b = arr[j];
          const aStart = new Date(`January 1, 2000 ${a.start}`).getTime();
          const aEnd = new Date(`January 1, 2000 ${a.end}`).getTime();
          const bStart = new Date(`January 1, 2000 ${b.start}`).getTime();
          const bEnd = new Date(`January 1, 2000 ${b.end}`).getTime();
          if (aStart < bEnd && bStart < aEnd) return true;
        }
      }
    }

    return false;
  };

  return !isLoading ? (
    <div className="flex flex-col w-full px-48 space-y-10 justify-center items-center mt-10">
      <div className="flex flex-row w-full justify-evenly">
        <SectionTimeTable schedules={selectedSchedules} />
        <div className="flex flex-col space-y-5 mt-20 w-1/4">
          <SectionSearch onSelect={handleSelect} />
          <div className="border border-enamelled-jewel p-4 rounded-md">
            {!selectedSectionDisplay ? (
              <p className="text-xl font-bold">Select a bloc</p>
            ) : (
              <>
                <p className="text-xl font-bold">
                  Timetable for {selectedSectionDisplay}
                </p>
                <p className="text-sm text-gray-600">
                  {hasConflicts()
                    ? "Conflicts are detected. See the conflict table below for details."
                    : "No conflicts were found in this schedule."}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center text-9xl font-bold">
      Loading...
    </div>
  );
};

export default Bloc;
