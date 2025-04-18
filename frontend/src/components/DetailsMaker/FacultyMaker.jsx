import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const FacultyMaker = ({ faculties, setMainFaculty, mainFaculty }) => {
  const { semesterFaculties, dispatch } = useSemesterContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [facultyFilteredList, setFacultyFilteredList] =
    useState(semesterFaculties);
  const [facultySearch, setFacultySearch] = useState("");
  const [facultyDisplay, setFacultyDisplay] = useState(mainFaculty);
  const [facultyDropdownVisible, setFacultyDropdownVisible] = useState(false);
  const [newFacultyFirstName, setNewFacultyFirstName] = useState("");
  const [newFacultyLastName, setNewFacultyLastName] = useState("");
  const [newFacultyEmployeeId, setNewFacultyEmployeeId] = useState("");
  const [newFacultyDepartment, setNewFacultyDepartment] = useState("");
  const [
    newFacultyDepartmentDropdownVisisble,
    setNewFacultyDepartmentDropdownVisisble,
  ] = useState(false);
  const [newFacultyError, setNewFacultyError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const facultyFilter = semesterFaculties.filter((e) => {
      return (
        e.firstName &&
        e.lastName &&
        (e.firstName + " " + e.lastName)
          .toLowerCase()
          .includes(facultySearch.toLowerCase())
      );
    });
    setFacultyFilteredList(facultyFilter);
  }, [facultySearch]);
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-3xl font-bold">Faculty</p>
      <div className="relative inline-block">
        <input
          className="outline-none border-2 w-full h-9 text-lg rounded-lg pl-2 border-black placeholder-black"
          type="text"
          placeholder="Faculty Name"
          onFocus={(e) => {
            setFacultySearch(e.target.value);
            setFacultyDropdownVisible(true);
          }}
          onBlur={() => {
            setFacultyDropdownVisible(false);
          }}
          onChange={(e) => {
            setFacultySearch(e.target.value);
          }}
          value={facultySearch}
        />
        <div
          className={`absolute w-full bg-white z-10 border-2 border-black rounded-lg p-1 ${
            !facultyDropdownVisible && "hidden"
          }`}
        >
          {facultyFilteredList.length > 0 ? (
            facultyFilteredList.map((data) => {
              return (
                <p
                  className="w-full max-w-full truncate text-lg hover:bg-placebo-turquoise cursor-pointer"
                  key={data._id}
                  onMouseDown={() => {
                    setFacultyDisplay({
                      firstName: data.firstName,
                      lastName: data.lastName,
                      employeeId: data.employeeId,
                      department: data.department,
                    });
                    setMainFaculty(data);
                  }}
                >
                  {`(${data.employeeId}) | `}
                  <strong>
                    {data.firstName} {data.lastName}
                  </strong>
                </p>
              );
            })
          ) : (
            <p>None</p>
          )}
        </div>
      </div>
      {facultyDisplay && (
        <>
          <input
            className="outline-none border-2 h-9 text-lg pl-2 rounded-lg bg-placebo-turquoise cursor-not-allowed border-black"
            value={facultyDisplay.firstName}
            readOnly
          />
          <input
            className="outline-none border-2 h-9 text-lg pl-2 rounded-lg bg-placebo-turquoise cursor-not-allowed border-black"
            value={facultyDisplay.lastName}
            readOnly
          />
          <input
            className="outline-none border-2 h-9 text-lg pl-2 rounded-lg bg-placebo-turquoise cursor-not-allowed border-black"
            value={facultyDisplay.employeeId}
            readOnly
          />
          <input
            className="outline-none border-2 h-9 text-lg pl-2 rounded-lg bg-placebo-turquoise cursor-not-allowed border-black"
            value={facultyDisplay.department}
            readOnly
          />
        </>
      )}
      <p className="underline cursor-pointer" onMouseDown={onOpen}>
        Create New Faculty
      </p>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p>New Faculty</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col space-y-4">
              <p>
                First Name:{" "}
                <input
                  placeholder="First Name"
                  className="w-1/2 pl-2 ml-3.5 border-2 border-black rounded-lg placeholder-black"
                  onChange={(e) => {
                    setNewFacultyFirstName(e.target.value);
                  }}
                  value={newFacultyFirstName}
                />
              </p>
              <p>
                Last Name:{" "}
                <input
                  placeholder="Last Name"
                  className="w-1/2 pl-2 ml-3.5 border-2 border-black rounded-lg placeholder-black"
                  onChange={(e) => {
                    setNewFacultyLastName(e.target.value);
                  }}
                  value={newFacultyLastName}
                />
              </p>
              <div className="flex flex-row">
                <p>Department: </p>
                <div className="relative inline-block ml-3 w-1/2">
                  <input
                    placeholder="Department"
                    className={`w-full pl-2 border-2 border-black rounded-lg placeholder-black`}
                    onFocus={() =>
                      setNewFacultyDepartmentDropdownVisisble(true)
                    }
                    onBlur={() =>
                      setNewFacultyDepartmentDropdownVisisble(false)
                    }
                    value={newFacultyDepartment}
                    readOnly
                  />
                  <div
                    className={`absolute w-full bg-white border-2 border-black rounded-lg ${
                      !newFacultyDepartmentDropdownVisisble && "hidden"
                    }`}
                  >
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewFacultyDepartment("DMPCS")}
                    >
                      DMPCS
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewFacultyDepartment("DFSC")}
                    >
                      DFSC
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewFacultyDepartment("DBSES")}
                    >
                      DBSES
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewFacultyDepartment("HSS")}
                    >
                      HSS
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewFacultyDepartment("SOM")}
                    >
                      SOM
                    </p>
                  </div>
                </div>
              </div>
              <p>
                Employee ID:{" "}
                <input
                  placeholder="Employee ID"
                  className="w-1/2 pl-2 border-2 border-black rounded-lg placeholder-black"
                  onChange={(e) => {
                    setNewFacultyEmployeeId(e.target.value);
                  }}
                  value={newFacultyEmployeeId}
                />
              </p>
            </div>
            {newFacultyError && (
              <div className="border-2 border-black bg-red-300 mt-5 p-3">
                {newFacultyError.error}
              </div>
            )}
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div>
              <div className="flex flex-row space-x-4">
                <button
                  className="w-20 h-10 border border-enamelled-jewel text-enamelled-jewel font-semibold transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
                  onClick={async () => {
                    const res = await fetch(
                      `http://localhost:4000/api/faculty/${params.id}`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          firstName: newFacultyFirstName,
                          lastName: newFacultyLastName,
                          employeeId: newFacultyEmployeeId,
                          department: newFacultyDepartment,
                        }),
                      }
                    );
                    const newFacultyData = await res.json();
                    if (newFacultyData.error) {
                      setNewFacultyError(newFacultyData);
                      return;
                    } else {
                      setMainFaculty(newFacultyData);
                      setFacultyDisplay(newFacultyData);
                      dispatch({
                        type: "CREATE_FACULTY",
                        payload: newFacultyData,
                      });
                      setFacultySearch("");
                      return onClose();
                    }
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="w-20 h-10 border border-enamelled-jewel text-enamelled-jewel font-semibold transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FacultyMaker;
