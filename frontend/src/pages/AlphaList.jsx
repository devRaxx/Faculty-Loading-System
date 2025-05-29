import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FilterBar from "../components/Filters/FilterBar";
import SearchBar from "../components/Filters/SearchBar";
import { HiPlus } from "react-icons/hi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useDisclosure } from "@chakra-ui/react";
import AlphaSchedList from "../components/Tables/AlphaSchedList";
import AddScheduleModal from "../modals/AddScheduleModal";
const AlphaList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="px-20 pt-10 text-center">
      <div className="flex flex-row space-x-20 mt-7">
        <div className="flex flex-col space-y-6">
          <SearchBar
            placeholder={searchInput ? searchInput : "Search"}
            setSearchInput={setSearchInput}
          />
          <button
            className="flex items-center font-bold justify-center text-xl border border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-48 h-11 transition ease-in duration-200 hover:shadow-custom"
            onClick={onOpen}
          >
            <HiPlus />
            Add
          </button>
          <button
            className="flex items-center font-bold justify-center text-xl border border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-48 h-11 transition ease-in duration-200 hover:shadow-custom"
            onClick={() => setEditing(!editing)}
          >
            <HiOutlinePencilSquare />
            Edit
          </button>
          <FilterBar />
        </div>
        <div className="w-full">
          <AlphaSchedList editing={editing} searchInput={searchInput} />
        </div>
      </div>
      <AddScheduleModal onClose={onClose} isOpen={isOpen} />
    </div>
  );
};

export default AlphaList;
