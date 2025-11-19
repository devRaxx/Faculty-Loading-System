import { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa";
import { FaXmark, FaAngleDown, FaEraser } from "react-icons/fa6";
import {
  getStartTime,
  getMatchingSection,
  generateTimeSlots,
} from "../../utils/schedTimeUtils";

const ScheduleMaker = ({ edit, weeklySchedule, setWeeklySchedule }) => {
  const [SectionStartTime, setSectionStartTime] = useState(
    edit ? weeklySchedule.startTime : ""
  );
  const [SectionEndTime, setSectionEndTime] = useState(
    edit ? weeklySchedule.endTime : ""
  );
  const [SectionDays, setSectionDays] = useState(
    edit ? weeklySchedule.day : []
  );
  const [SectionDropdownVisible, setSectionDropdownVisible] = useState(false);
  const [StartTimeDropdownVisible, setStartTimeDropdownVisible] =
    useState(false);
  const [EndtimeDropdownVisible, setEndtimeDropdownVisible] = useState(false);
  const [Section, setSection] = useState(edit ? weeklySchedule.section : "");
  const [isManualSection, setIsManualSection] = useState(false);
  const [MondayDropdownVisible, setMondayDropdownVisible] = useState(false);

  const startTimeSlots = [
    "7:00 AM",
    "7:30 AM",
    "8:30 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "1:00 PM",
    "2:30 PM",
    "3:00 PM",
    "4:00 PM",
    "5:30 PM",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDayDisplayLetter = (day) => {
    if (day === "Thursday") return "Th";
    else if (day === "Saturday") return "S";
    else if (day === "NA") return "NA";
    return day.charAt(0);
  };

  const getSingleDayDisplay = () => {
    if (SectionDays.length === 1) {
      return getDayDisplayLetter(SectionDays[0]);
    }
    return "M"; 
  };

  useEffect(() => {
    if (!isManualSection) {
      const autoSection = getMatchingSection({
        time: SectionStartTime,
        day: SectionDays,
      });
      setSection(autoSection || Section);
    }
  }, [SectionStartTime, SectionDays, isManualSection]);

  useEffect(() => {
    setWeeklySchedule({
      section: Section,
      startTime: SectionStartTime,
      endTime: SectionEndTime,
      day: SectionDays,
    });
  }, [Section, SectionStartTime, SectionEndTime, SectionDays]);

  // Function to display the table
  const [tableVisible, setTableVisible] = useState(false);
  const displayTable = () => {
    const scheduleData = [
      ["Time", "TTH", "WF", "Monday"],
      ["07:00-08:30", "A", "I", "Q"],
      ["08:30-10:00", "B", "J", "R"],
      ["10:00-11:30", "C", "K", "S"],
      ["11:30-01:00", "D", "L", "T"],
      ["01:00-02:30", "E", "M", "U"],
      ["02:30-04:00", "F", "N", "V"],
      ["04:00-05:30", "G", "O", "W"],
      ["05:30-07:00", "H", "P", "X"],
    ];

    return (
      <div className="absolute z-10 mt-[500px]">
        <table className="table-auto border-collapse border border-gray-300 w-full text-center">
          <thead className="bg-gray-200">
            {scheduleData.slice(0, 1).map((row, index) => (
              <tr key={`header-${index}`}>
                {row.map((cell, cellIndex) => (
                  <th
                    key={`header-cell-${cellIndex}`}
                    className="border border-gray-300 px-4 py-2 font-bold"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {scheduleData.slice(1).map((row, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="relative inline-block">
        <div className="flex flex-row space-x-4">
          {/* Section Input */}
          <div className="relative inline-block">
            <input
              type="text"
              placeholder="Section"
              className="outline-none border-2 border-black rounded-lg w-20 h-9 text-lg text-center placeholder-black"
              value={Section}
              onChange={(e) => {
                setSection(e.target.value);
                setIsManualSection(true);
              }}
            />
          </div>

          <div>
            <p className="font-bold pt-1">:</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex flex-row space-x-2 items-center">
              <div className="relative inline-block w-32">
                <div className="flex flex-row items-center w-full border-2 border-black rounded-lg px-1">
                  <input
                    className="outline-none rounded-lg text-center w-full h-9 text-lg cursor-pointer placeholder-black"
                    placeholder="Start Time"
                    onFocus={() => setStartTimeDropdownVisible(true)}
                    onBlur={() => setStartTimeDropdownVisible(false)}
                    value={SectionStartTime}
                    readOnly
                  />
                  <FaAngleDown />
                </div>

                <div
                  className={`absolute flex flex-col max-h-40 overflow-scroll w-full border-2 border-black rounded-lg z-10 ${
                    !StartTimeDropdownVisible ? "hidden" : ""
                  }`}
                >
                  {startTimeSlots.map((time) => (
                    <p
                      className="bg-white cursor-pointer text-center hover:bg-placebo-turquoise"
                      key={time}
                      onMouseDown={() => {
                        setSectionStartTime(time);
                        setIsManualSection(false);
                      }}
                    >
                      {time}
                    </p>
                  ))}
                </div>
              </div>

              <div className="relative inline-block w-32">
                <div className="flex flex-row items-center w-full border-2 border-black rounded-lg px-1">
                  <input
                    className="outline-none rounded-lg text-center w-full h-9 text-lg cursor-pointer placeholder-black"
                    placeholder="End Time"
                    onFocus={() => setEndtimeDropdownVisible(true)}
                    onBlur={() => setEndtimeDropdownVisible(false)}
                    value={SectionEndTime}
                    readOnly
                  />
                  <FaAngleDown />
                </div>

                <div
                  className={`absolute flex flex-col max-h-40 overflow-scroll w-full border-2 border-black rounded-lg z-10 ${
                    !EndtimeDropdownVisible ? "hidden" : ""
                  }`}
                >
                  {SectionStartTime ? (
                    generateTimeSlots(SectionStartTime).map((time) => (
                      <p
                        className="bg-white cursor-pointer"
                        key={time}
                        onMouseDown={() => setSectionEndTime(time)}
                      >
                        {time}
                      </p>
                    ))
                  ) : (
                    <p className="bg-white cursor-pointer text-center hover:bg-placebo-turquoise">
                      -No Start Time-
                    </p>
                  )}
                </div>
              </div>

              <div className="pl-2">
                <FaEraser
                  className="cursor-pointer text-lg hover:bg-gray-300 hover:rounded-lg"
                  onMouseDown={() => {
                    setSection("");
                    setSectionDays([]);
                    setSectionStartTime("");
                    setSectionEndTime("");
                    setIsManualSection(false);
                  }}
                />
              </div>
              {/* None Button */}
              <div className="pl-2">
                <button
                  className="bg-gray-200 border-2 border-black rounded-lg px-3 py-1 cursor-pointer hover:bg-gray-300"
                  onMouseDown={() => {
                    setSection("NA");
                    setSectionDays(["NA"]);
                    setSectionStartTime("0:00");
                    setSectionEndTime("0:00");
                    setIsManualSection(false);
                  }}
                >
                  None
                </button>
              </div>
              <FaImages onClick={() => setTableVisible(!tableVisible)} />
              {tableVisible && displayTable()}
            </div>

            <div className="flex flex-row w-full justify-start space-x-3">
              <div className="relative inline-block">
                <input
                  className={`border w-16 h-9 text-lg flex justify-center border-black px-1 rounded-lg text-center cursor-pointer hover:bg-placebo-turquoise ${
                    SectionDays.length === 1
                      ? "bg-placebo-turquoise shadow-custom"
                      : ""
                  }`}
                  onMouseDown={() => {
                    setMondayDropdownVisible(!MondayDropdownVisible);
                  }}
                  type="button"
                  value={getSingleDayDisplay()}
                  readOnly
                />

                <div
                  className={`absolute flex flex-col max-h-40 overflow-scroll w-full border-2 border-black rounded-lg z-10 ${
                    !MondayDropdownVisible ? "hidden" : ""
                  }`}
                >
                  {weekDays.map((day) => (
                    <p
                      key={day}
                      className="bg-white cursor-pointer text-center hover:bg-placebo-turquoise"
                      onMouseDown={() => {
                        setSectionDays([day]);
                        setMondayDropdownVisible(false);
                        setIsManualSection(false);
                      }}
                    >
                      {getDayDisplayLetter(day)}
                    </p>
                  ))}
                </div>
              </div>

              <input
                className={`border w-16 h-9 text-lg flex justify-center border-black px-1 rounded-lg text-center cursor-pointer hover:bg-placebo-turquoise ${
                  SectionDays.includes("Tuesday") &&
                  SectionDays.includes("Thursday")
                    ? "bg-placebo-turquoise shadow-custom"
                    : ""
                }`}
                onMouseDown={() => {
                  const updatedDays = [...SectionDays];
                  if (
                    SectionDays.includes("Tuesday") &&
                    SectionDays.includes("Thursday")
                  ) {
                    setSectionDays(
                      updatedDays.filter(
                        (day) => day !== "Tuesday" && day !== "Thursday"
                      )
                    );
                  } else {
                    const filteredDays = updatedDays.filter(
                      (day) => day !== "Tuesday" && day !== "Thursday"
                    );
                    setSectionDays([...filteredDays, "Tuesday", "Thursday"]);
                  }
                  setIsManualSection(false);
                }}
                type="button"
                value="TTh"
                readOnly
              />

              <input
                className={`border w-16 h-9 text-lg flex justify-center border-black px-1 rounded-lg text-center cursor-pointer hover:bg-placebo-turquoise ${
                  SectionDays.includes("Wednesday") &&
                  SectionDays.includes("Friday")
                    ? "bg-placebo-turquoise shadow-custom"
                    : ""
                }`}
                onMouseDown={() => {
                  const updatedDays = [...SectionDays];
                  if (
                    SectionDays.includes("Wednesday") &&
                    SectionDays.includes("Friday")
                  ) {
                    setSectionDays(
                      updatedDays.filter(
                        (day) => day !== "Wednesday" && day !== "Friday"
                      )
                    );
                  } else {
                    const filteredDays = updatedDays.filter(
                      (day) => day !== "Wednesday" && day !== "Friday"
                    );
                    setSectionDays([...filteredDays, "Wednesday", "Friday"]);
                  }
                  setIsManualSection(false);
                }}
                type="button"
                value="WF"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMaker;
