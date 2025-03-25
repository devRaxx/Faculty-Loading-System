import { FaXmark } from "react-icons/fa6";
import ScheduleMaker from "./WeeklyScheduleMaker";
import { useState } from "react";

const SectionMaker = ({ mainWeeklySchedule, setMainWeeklySchedule }) => {
  const [sectionComponents, setSectionComponents] = useState([
    <ScheduleMaker
      key={1}
      index={0}
      weeklySchedule={mainWeeklySchedule}
      setWeeklySchedule={setMainWeeklySchedule}
    />,
  ]);
  return (
    <div>
      <p className="text-3xl font-bold">Schedule</p>
      <div className="flex flex-wrap flex-col space-y-4">
        {sectionComponents.map((component, index, self) => {
          return (
            <div className="flex flex-row" key={index}>
              {component}
              {index > 0 && (
                <div className="pl-2 pt-3">
                  <FaXmark
                    className="text-lg cursor-pointer hover:bg-red-300 hover:rounded-lg"
                    onMouseDown={() => {
                      self.splice(index, 1);
                      setSectionComponents(self);
                      const temp = mainWeeklySchedule;
                      temp.splice(index, 1);
                      setMainWeeklySchedule(temp);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add more section */}
      <p
        className={`underline px-1 mt-2 max-w-max cursor-pointer ${
          sectionComponents.length == 3 && "hidden"
        }`}
        onMouseDown={() => {
          setSectionComponents((prev) => [
            ...prev,
            <ScheduleMaker
              key={sectionComponents.length + 1}
              index={sectionComponents.length - 1}
              weeklySchedule={mainWeeklySchedule}
              setWeeklySchedule={setMainWeeklySchedule}
            />,
          ]);
        }}
      >
        Add Schedule
      </p>
    </div>
  );
};

export default SectionMaker;
