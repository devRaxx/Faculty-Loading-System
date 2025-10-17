import { useEffect, useMemo, useState } from "react";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { FaAngleDown } from "react-icons/fa6";
import PropTypes from "prop-types";

const formatStudentDisplay = ({ name, bloc, yearLevel }) => {
  return `${yearLevel || ""}${name || ""}${bloc ? " - " + bloc : ""}`;
};

const formatProgramDisplay = ({ name, yearLevel }) => {
  return `${yearLevel || ""}${name || ""}`;
};

const SectionSearch = ({ onSelect }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { semesterSchedules } = useSemesterContext();

  // Debounce the input to avoid re-filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 150);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Build a mapping of display -> schedules (program and block) and an items array
  const { items, displayToSchedules } = useMemo(() => {
    const programMap = new Map();
    const blockMap = new Map();

    (semesterSchedules || []).forEach((sched) => {
      (sched.students || []).forEach((stu) => {
        const blockDisplay = formatStudentDisplay(stu);
        const programDisplay = formatProgramDisplay(stu);

        if (!blockMap.has(blockDisplay)) blockMap.set(blockDisplay, []);
        blockMap.get(blockDisplay).push(sched);

        if (!programMap.has(programDisplay)) programMap.set(programDisplay, []);
        programMap.get(programDisplay).push(sched);
      });
    });

    const items = [];
    const displayToSchedules = {};

    // program entries first
    for (const [progDisplay, schedules] of programMap.entries()) {
      items.push({
        display: progDisplay,
        type: "program",
        count: schedules.length,
      });
      displayToSchedules[progDisplay] = schedules;
    }

    // then block entries if not already present as a program display
    for (const [blockDisplay, schedules] of blockMap.entries()) {
      if (!displayToSchedules[blockDisplay]) {
        items.push({
          display: blockDisplay,
          type: "block",
          count: schedules.length,
        });
        displayToSchedules[blockDisplay] = schedules;
      }
    }

    return { items, displayToSchedules };
  }, [semesterSchedules]);

  const filtered = useMemo(() => {
    const q = (debouncedSearch || "").toLowerCase();
    if (!q) return items.slice(0, 20);
    return items
      .filter((it) => it.display.toLowerCase().includes(q))
      .slice(0, 20);
  }, [items, debouncedSearch]);

  const handleSelection = (display) => {
    setSearchInput(display);
    setTimeout(() => setDropdownVisible(false), 100);
    const matchedSchedules = displayToSchedules[display] || [];
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
              className="text-2xl text-enamelled-jewel h-8 hover:bg-placebo-turquoise cursor-pointer rounded-md px-2 flex justify-between items-center"
              onMouseDown={() => handleSelection(it.display)}
            >
              <span>{it.display}</span>
              <span className="text-sm text-gray-400">{it.count}</span>
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
