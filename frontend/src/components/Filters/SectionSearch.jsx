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

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 150);
    return () => clearTimeout(t);
  }, [searchInput]);

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

    for (const [progDisplay, schedules] of programMap.entries()) {
      items.push({
        display: progDisplay,
        type: "program",
        count: schedules.length,
      });
      displayToSchedules[progDisplay] = schedules;
    }

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

    const matchedItem = items.find((it) => it.display === display);
    const matchedSchedules = displayToSchedules[display] || [];

    if (matchedItem && matchedItem.type === "block") {
      const normalize = (s = "") => s.toString().replace(/\s|-/g, "").toLowerCase();
      const normBlock = normalize(display);

      const progItem = items.find(
        (it) => it.type === "program" && normBlock.startsWith(normalize(it.display))
      );

      const progDisplay = progItem ? progItem.display : display.split(" - ")[0];
      const programSchedules = displayToSchedules[progDisplay] || [];

      const lectures = programSchedules.filter((s) => {
        const t = (s.course?.type || "").toString().toUpperCase();
        return t !== "LAB";
      });

      const labs = matchedSchedules.filter((s) => {
        const t = (s.course?.type || "").toString().toUpperCase();
        return t === "LAB";
      });

      const map = new Map();
      [...lectures, ...labs].forEach((s, idx) => {
        if (!s) return;
        const key = s._id || JSON.stringify({
          course: s.course?.code || s.course,
          section: s.section,
          start: s.schedule?.[0]?.startTime || s.startTime || idx,
        });
        if (!map.has(key)) map.set(key, s);
      });

      const combined = Array.from(map.values());
      onSelect(display, combined);
      return;
    }

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
