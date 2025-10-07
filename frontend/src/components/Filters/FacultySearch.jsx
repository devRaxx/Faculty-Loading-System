import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { FaAngleDown } from "react-icons/fa6";

const FacultySearch = () => {
  const [queryParameters] = useSearchParams();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const { semesterFaculties, dispatch } = useSemesterContext();

  const handleFacultySelection = (faculty) => {
    setSelectedFaculty(faculty);
    setSearchInput(`${faculty.firstName} ${faculty.lastName}`);
    dispatch({
      type: "SELECT_FACULTY",
      payload: faculty,
      query: queryParameters.getAll("filter"),
    });
    setDropdownVisible(false);
  };

  const filteredFaculties = semesterFaculties
    ? semesterFaculties
        .filter((faculty) =>
          `${faculty.firstName} ${faculty.lastName}`
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        )
        .slice(0, 10)
    : [];

  return (
    <div className="relative inline-block w-full">
      <div className="flex flex-row items-center w-full border-2 border-enamelled-jewel rounded-md px-1">
        <input
          className="w-full text-2xl font-semibold text-enamelled-jewel p-1 outline-none"
          onFocus={() => {
            setDropdownVisible(true);
          }}
          onBlur={() => {
            setTimeout(() => setDropdownVisible(false), 200);
          }}
          placeholder={
            selectedFaculty
              ? `${selectedFaculty.firstName} ${selectedFaculty.lastName}`
              : "Search Faculty"
          }
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
        {filteredFaculties.length > 0 ? (
          filteredFaculties.map((faculty) => (
            <p
              key={faculty._id}
              className="text-2xl text-enamelled-jewel h-8 hover:bg-placebo-turquoise cursor-pointer rounded-md px-2"
              onMouseDown={() => handleFacultySelection(faculty)}
            >
              {faculty.firstName} {faculty.lastName}
            </p>
          ))
        ) : (
          <p className="text-2xl text-enamelled-jewel p-2">No faculty found</p>
        )}
      </div>
    </div>
  );
};

export default FacultySearch;
