import { useState } from "react";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { FaAngleDown } from "react-icons/fa6";
import PropTypes from "prop-types";

const formatStudentDisplay = ({ name, bloc, yearLevel }) => {
  return `${yearLevel || ""}${name || ""}${bloc ? " - " + bloc : ""}`;
};

const SectionSearch = ({ onSelect }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { semesterSchedules } = useSemesterContext();

  const studentItems = (semesterSchedules || []).flatMap((s) =>
    (s.students || []).map((stu) => ({
      display: formatStudentDisplay(stu),
      scheduleItem: s,
    }))
  );

  // unique by display
  const uniqueStudentsMap = {};
  studentItems.forEach((it) => {
    if (it.display && / - \d+$/.test(it.display)) {
      if (!uniqueStudentsMap[it.display]) uniqueStudentsMap[it.display] = it;
    }
  });
  const uniqueStudents = Object.values(uniqueStudentsMap);

  const filtered = uniqueStudents
    .filter((it) =>
      it.display.toLowerCase().includes(searchInput.toLowerCase())
    )
    .slice(0, 20);

  const handleSelection = (display) => {
    setSearchInput(display);
    setTimeout(() => setDropdownVisible(false), 100);
    const matchedSchedules = (semesterSchedules || []).filter((s) =>
      (s.students || []).some((stu) => formatStudentDisplay(stu) === display)
    );
    onSelect(display, matchedSchedules);
  };

  return (
    <div className="relative inline-block w-full">
      <div className="flex flex-row items-center w-full border-2 border-enamelled-jewel rounded-md px-1">
        <input
          className="w-full text-2xl font-semibold text-enamelled-jewel p-1 outline-none"
          onFocus={() => setDropdownVisible(true)}
          onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
          placeholder={searchInput ? searchInput : "Search Section"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <FaAngleDown className="text-enamelled-jewel" />
      </div>

      <div
        className={`absolute w-full bg-white border-2 border-enamelled-jewel rounded-md mt-1 z-10 overflow-hidden max-h-60 overflow-y-auto ${
          !dropdownVisible && "hidden"
        }`}
      >
        {filtered.length > 0 ? (
          filtered.map((it) => (
            <p
              key={it.display}
              className="text-2xl text-enamelled-jewel h-8 hover:bg-placebo-turquoise cursor-pointer rounded-md px-2"
              onMouseDown={() => handleSelection(it.display)}
            >
              {it.display}
            </p>
          ))
        ) : (
          <p className="text-2xl text-enamelled-jewel p-2">No section found</p>
        )}
      </div>
    </div>
  );
};

export default SectionSearch;

SectionSearch.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
