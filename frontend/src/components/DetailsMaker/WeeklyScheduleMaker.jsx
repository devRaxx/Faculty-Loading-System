import { useEffect, useState } from "react";
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

  const section = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Helper function to get the display letter for a day
  const getDayDisplayLetter = (day) => {
    if (day === "Thursday") return "Th";
    else if (day === "NA") return "NA";
    return day.charAt(0);
  };

  // Get the current single day display value
  const getSingleDayDisplay = () => {
    if (SectionDays.length === 1) {
      return getDayDisplayLetter(SectionDays[0]);
    }
    return "M"; // Default display
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

  return (
    <div className="flex flex-col space-y-1">
      <div className="relative inline-block">
        <div className="flex flex-row space-x-4">
          {/* Section Selector */}
          <div className="relative inline-block">
            <input
              type="text"
              placeholder="Section"
              className="outline-none border-2 border-black rounded-lg w-20 h-9 text-lg cursor-pointer text-center placeholder-black"
              value={Section}
              onFocus={() => setSectionDropdownVisible(true)}
              onBlur={() => setSectionDropdownVisible(false)}
              readOnly
            />

            <div
              className={`absolute flex flex-col h-40 overflow-scroll w-20 border-2 border-black rounded-lg z-10 ${
                !SectionDropdownVisible ? "hidden" : ""
              }`}
            >
              {section.map((letter) => (
                <p
                  key={letter}
                  className="w-full text-center bg-white hover:bg-placebo-turquoise cursor-pointer"
                  onMouseDown={() => {
                    setSection(letter);
                    setIsManualSection(true);
                  }}
                >
                  {letter}
                </p>
              ))}
            </div>
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
