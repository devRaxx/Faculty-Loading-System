import { useState } from "react";
import SectionSearch from "../components/Filters/SectionSearch";
import SectionTimeTable from "../components/Tables/SectionTimeTable";
import { useSemesterContext } from "../hooks/useSemesterContext";

const Bloc = () => {
  const [selectedSectionDisplay, setSelectedSectionDisplay] = useState(null);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const { isLoading } = useSemesterContext();

  const handleSelect = (display, schedules) => {
    setSelectedSectionDisplay(display);
    setSelectedSchedules(schedules || []);
  };

  return !isLoading ? (
    <div className="flex flex-col w-full px-48 space-y-10 justify-center items-center mt-10">
      <div className="flex flex-row w-full justify-evenly">
        <SectionTimeTable schedules={selectedSchedules} />
        <div className="flex flex-col space-y-5 mt-20 w-1/4">
          <SectionSearch onSelect={handleSelect} />
          <div className="border border-enamelled-jewel p-4 rounded-md">
            <p className="text-xl font-bold">{selectedSectionDisplay || "Select a section"}</p>
            <p className="text-sm text-gray-600">Shows timetable for the selected lab section</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center text-9xl font-bold">Loading...</div>
  );
};

export default Bloc;
