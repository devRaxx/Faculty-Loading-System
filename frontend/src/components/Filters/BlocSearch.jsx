import { useState, useEffect } from "react";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { FaAngleDown } from "react-icons/fa6";

const BlocSearch = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const { semesterBlocs, dispatch } = useSemesterContext();

  useEffect(() => {}, [semesterBlocs]);

  const formatBlocName = (bloc) => {
    return bloc && bloc.yearLevel && bloc.name && bloc.bloc
      ? `${bloc.yearLevel}${bloc.name}-${bloc.bloc}`
      : "Unknown Bloc";
  };

  const handleBlocSelection = (bloc) => {
    if (!bloc || !bloc._id) {
      console.error("Invalid bloc selected:", bloc);
      return; 
    }

    setSelectedBloc(bloc);
    setSearchInput(formatBlocName(bloc)); 
    dispatch({
      type: "SELECT_BLOC",
      payload: bloc,
    });

    setDropdownVisible(false);
  };

  const blocs = Array.isArray(semesterBlocs) ? semesterBlocs : [];

  const filteredBlocs = blocs
    .filter((bloc) =>
      formatBlocName(bloc).toLowerCase().includes(searchInput.toLowerCase())
    )
    .slice(0, 10); 

  return (
    <div className="relative inline-block w-full">
      <div className="flex flex-row items-center w-full border-2 border-enamelled-jewel rounded-md px-1">
        <input
          className="w-full text-2xl font-semibold text-enamelled-jewel p-1 outline-none"
          onFocus={() => setDropdownVisible(true)}
          onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
          placeholder={
            selectedBloc ? formatBlocName(selectedBloc) : "Select Bloc"
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
        {filteredBlocs.length > 0 ? (
          filteredBlocs.map((bloc) => (
            <p
              key={bloc._id}
              className="text-2xl text-enamelled-jewel h-8 hover:bg-placebo-turquoise cursor-pointer rounded-md px-2"
              onMouseDown={() => handleBlocSelection(bloc)}
            >
              {formatBlocName(bloc)}
            </p>
          ))
        ) : (
          <p className="text-2xl text-enamelled-jewel p-2">No blocs found</p>
        )}
      </div>
    </div>
  );
};

export default BlocSearch;
