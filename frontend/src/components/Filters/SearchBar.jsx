import { useState } from "react";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
const SearchBar = ({ placeholder, setSearchInput }) => {
  const [searchInput, searchInputUpdate] = useState("");
  return (
    <InputGroup className="m-0 border border-enamelled-jewel rounded-lg">
      <InputLeftElement pointerEvents="none">
        <Search2Icon color="gray" />
      </InputLeftElement>
      <Input
        type="search"
        placeholder={`${placeholder}`}
        htmlSize={3}
        value={searchInput}
        onChange={(e) => {
          const value = e.target.value;
          searchInputUpdate(value);
          setSearchInput(value);
        }}
      />
    </InputGroup>
  );
};

export default SearchBar;
