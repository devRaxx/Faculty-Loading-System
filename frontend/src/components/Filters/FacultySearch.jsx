import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFacultyContext } from "../../hooks/useFacultyContext";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { FaAngleDown } from "react-icons/fa6";

const FacultySearch = () => {
  const [queryParameters] = useSearchParams();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const { semesterFaculties, dispatch } = useSemesterContext();

  const handleFacultySelection = (faculty) => {
    setSelectedFaculty(faculty); // Update selected faculty
    dispatch({
      type: "SELECT_FACULTY",
      payload: faculty,
      query: queryParameters.getAll("filter"),
    });
    setDropdownVisible(false); // Hide dropdown after selection
  };

  return (
    <div className="relative inline-block">
      <div className="flex flex-row items-center w-full border-2 border-enamelled-jewel rounded-md px-1">
        <input
          className="w-full text-2xl font-semibold text-enamelled-jewel p-1 outline-none"
          onFocus={() => {
            setDropdownVisible(true);
          }}
          onBlur={() => {
            setTimeout(() => setDropdownVisible(false), 200); // Prevent immediate hiding
          }}
          placeholder={
            selectedFaculty
              ? `${selectedFaculty.firstName} ${selectedFaculty.lastName}`
              : "Faculty"
          }
          value={
            selectedFaculty
              ? `${selectedFaculty.firstName} ${selectedFaculty.lastName}`
              : ""
          }
          readOnly
        />
        <FaAngleDown className="text-enamelled-jewel" />
      </div>
      <div
        className={`absolute w-full bg-white border-2 border-enamelled-jewel rounded-md ${
          !dropdownVisible && "hidden"
        }`}
      >
        {semesterFaculties && semesterFaculties.length > 0 ? (
          semesterFaculties.map((faculty) => (
            <p
              key={faculty._id}
              className="text-2xl text-enamelled-jewel h-8 hover:bg-placebo-turquoise cursor-pointer rounded-md px-2"
              onMouseDown={() => handleFacultySelection(faculty)}
            >
              {faculty.firstName} {faculty.lastName}
            </p>
          ))
        ) : (
          <p>No faculty</p>
        )}
      </div>
    </div>
  );
};

export default FacultySearch;
