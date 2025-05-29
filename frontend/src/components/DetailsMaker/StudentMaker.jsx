import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useParams } from "react-router-dom";
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
import { useSemesterContext } from "../../hooks/useSemesterContext";
const StudentMaker = ({
  courseType,
  setStudents,
  students,
  blocs,
  degreePrograms,
}) => {
  const { semesterDegreePrograms, semesterBlocs, dispatch } =
    useSemesterContext();
  const [chosenStudents, setChosenStudents] = useState([]);
  const [semBlocs, setSemBlocs] = useState(semesterBlocs);

  const [semDegreePrograms, setSemDegreePrograms] = useState(
    semesterDegreePrograms
  );

  const [dropdown, setDropdown] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const params = useParams();

  const {
    isOpen: degreeProgramIsOpen,
    onOpen: degreeProgramOnOpen,
    onClose: degreeProgramOnClose,
  } = useDisclosure();
  const [newDegreeProgramName, setNewDegreeProgramName] = useState("");
  const [newDegreeProgramYearLevel, setNewDegreeProgramYearLevel] =
    useState("");
  const [newDegreeProgramDepartment, setNewDegreeProgramDepartment] =
    useState("");
  const [newDegreeProgramDropdownVisible, setNewDegreeProgramDropdownVisible] =
    useState(false);
  const [newDegreeProgramError, setNewDegreeProgramError] = useState(null);

  const {
    isOpen: blocIsOpen,
    onOpen: blocOnOpen,
    onClose: blocOnClose,
  } = useDisclosure();
  const [newBlocNumber, setNewBlocNumber] = useState("");
  const [newBlocDegreeProgram, setNewBlocDegreeProgram] = useState("");
  const [
    newBlocDegreeProgramDropdownVisible,
    setNewBlocDegreeProgramDropdownVisible,
  ] = useState(false);
  const [newBlocError, setNewBlocError] = useState(null);

  const triggerDropdown = () => {
    console.log(courseType);
    if (courseType.type == "LEC" || courseType.type == "NA") {
      setDropdown(
        semesterDegreePrograms.filter(
          (degreePrograms) =>
            !students.some(
              (student) =>
                (
                  student.yearLevel +
                  student.name +
                  `${student.bloc && "Bloc " + student.bloc}`
                ).toLowerCase() ===
                (
                  degreePrograms.yearLevel +
                  degreePrograms.name +
                  `${degreePrograms.bloc && "Bloc " + degreePrograms.bloc}`
                ).toLowerCase()
            )
        )
      );
    } else if (courseType.type == "LAB") {
      setDropdown(
        semesterBlocs.filter(
          (semBloc) =>
            !students.some(
              (student) =>
                (
                  student.yearLevel +
                  student.name +
                  `${student.bloc && "Bloc " + student.bloc}`
                ).toLowerCase() ===
                (
                  semBloc.yearLevel +
                  semBloc.name +
                  `${semBloc.bloc && "Bloc " + semBloc.bloc}`
                ).toLowerCase()
            )
        )
      );
    } else {
      setDropdown([]);
    }
  };

  useEffect(() => {
    const studentFilter = (
      courseType.type == "LEC" || courseType.type == "NA"
        ? semesterDegreePrograms
        : courseType.type == "LAB"
        ? semesterBlocs
        : []
    ).filter((data) => {
      return (
        data.name &&
        (data.yearLevel + data.name + `${data.bloc && "Bloc " + data.bloc}`)
          .toLowerCase()
          .includes(studentSearch.toLowerCase())
      );
    });
    setDropdown(studentFilter);
  }, [studentSearch]);

  return (
    <div className="flex flex-col space-y-2 relative">
      <p className="text-3xl font-bold">Students</p>
      <div className="relative inline-block">
        <input
          className="outline-none border-2 h-9 text-lg pl-2 border-black rounded-lg placeholder-black"
          placeholder={
            courseType
              ? courseType.type == "LEC" || courseType.type == "NA"
                ? "Degree Program"
                : "Bloc"
              : "Choose a Course First"
          }
          onFocus={(e) => {
            setDropdownVisible(true);
            setStudentSearch(e.target.value);
            triggerDropdown();
          }}
          onBlur={() => {
            setDropdownVisible(false);
          }}
          onChange={(e) => setStudentSearch(e.target.value)}
          value={studentSearch}
        />
        <div
          className={`absolute w-full bg-white border-2 z-10 border-black ${
            !dropdownVisible && "hidden"
          }`}
        >
          {dropdown.length > 0 ? (
            dropdown.map((course, index, self) => {
              return (
                <p
                  key={course._id}
                  className="h-9 text-lg pl-2 pt-1 hover:bg-placebo-turquoise cursor-pointer"
                  onMouseDown={() => {
                    setChosenStudents([...chosenStudents, course]);
                    setStudents([...students, course]);
                    self.splice(index, 1);
                    setDropdown(self);
                  }}
                >
                  {course.yearLevel}
                  {course.name}
                  {course.bloc && ` Bloc ${course.bloc}`}
                </p>
              );
            })
          ) : (
            <p className="h-9 text-lg pl-2 pt-1 cursor-pointer">None</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap flex-col space-y-2">
        {students.length > 0 &&
          students.map((student, index, self) => {
            return (
              <div
                key={student._id}
                className="w-full border-2 border-black bg-placebo-turquoise h-9 rounded-lg flex flex-row justify-between items-center"
              >
                <div className="text-center text-lg pl-3 pt-1">
                  {student.yearLevel +
                    student.name +
                    `${student.bloc ? " Bloc " + student.bloc : ""}`}
                </div>
                <FaXmark
                  onMouseDown={() => {
                    setDropdown([...dropdown, student]);
                    self.splice(index, 1);
                    setStudents(self);
                  }}
                />
              </div>
            );
          })}
      </div>
      <p
        className={`underline cursor-pointer ${
          courseType.type == "None" && "hidden"
        }`}
        onMouseDown={() => {
          if (courseType.type == "LEC" || courseType.type == "NA") {
            return degreeProgramOnOpen();
          } else if (courseType.type == "LAB") {
            return blocOnOpen();
          }
        }}
      >
        Create New {courseType.type == "LAB" ? "Bloc" : "Degree Program"}
      </p>

      {/* Create Degree Program */}
      <Modal isOpen={degreeProgramIsOpen} onClose={degreeProgramOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p>New Degree Program</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col space-y-4">
              <p>
                Name:{" "}
                <input
                  placeholder="Degree Name"
                  className="w-1/2 pl-2 ml-12 border-2 border-black rounded-lg placeholder-black"
                  onChange={(e) => {
                    setNewDegreeProgramName(e.target.value);
                  }}
                  value={newDegreeProgramName}
                />
              </p>
              <p>
                Year Level:{" "}
                <input
                  placeholder="eg: 1"
                  className="w-1/2 pl-2 ml-4 border-2 border-black rounded-lg  placeholder-black"
                  onChange={(e) => {
                    setNewDegreeProgramYearLevel(e.target.value);
                  }}
                  value={newDegreeProgramYearLevel}
                />
              </p>
              <div className="flex flex-row">
                <p>Department: </p>
                <div className="relative inline-block ml-3 w-1/2">
                  <input
                    placeholder="Department"
                    className={`w-full pl-2 border-2 border-black rounded-lg placeholder-black`}
                    onFocus={() => setNewDegreeProgramDropdownVisible(true)}
                    onBlur={() => setNewDegreeProgramDropdownVisible(false)}
                    value={newDegreeProgramDepartment}
                    readOnly
                  />
                  <div
                    className={`absolute w-full bg-white border-2 border-black rounded-lg ${
                      !newDegreeProgramDropdownVisible && "hidden"
                    }`}
                  >
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewDegreeProgramDepartment("DMPCS")}
                    >
                      DMPCS
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewDegreeProgramDepartment("DFSC")}
                    >
                      DFSC
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewDegreeProgramDepartment("DBSES")}
                    >
                      DBSES
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewDegreeProgramDepartment("HSS")}
                    >
                      HSS
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                      onMouseDown={() => setNewDegreeProgramDepartment("SOM")}
                    >
                      SOM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {newDegreeProgramError && (
              <div className="bg-red-300 border-2 border-black p-3 mt-3">
                {newDegreeProgramError.error}
              </div>
            )}
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div>
              <div className="flex flex-row space-x-4">
                <button
                  className="w-20 h-10 border border-enamelled-jewel transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
                  onClick={async () => {
                    const res = await fetch(
                      `https://faculty-loading-system.vercel.app/api/degreeprogram/${params.id}`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: newDegreeProgramName,
                          yearLevel: newDegreeProgramYearLevel,
                          department: newDegreeProgramDepartment,
                        }),
                      }
                    );
                    const newDegreeProgramData = await res.json();
                    if (newDegreeProgramData.error) {
                      return setNewDegreeProgramError(newDegreeProgramData);
                    } else {
                      dispatch({
                        type: "CREATE_DEGREE_PROGRAM",
                        payload: newDegreeProgramData,
                      });
                      setChosenStudents([
                        ...chosenStudents,
                        newDegreeProgramData,
                      ]);
                      setStudents([...students, newDegreeProgramData]);
                      return degreeProgramOnClose();
                    }
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    return degreeProgramOnClose();
                  }}
                  className="w-20 h-10 border border-enamelled-jewel transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create New Bloc */}
      <Modal isOpen={blocIsOpen} onClose={blocOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p>New Bloc</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col space-y-4">
              {/* <p>Degree Program: <input placeholder="First Name" className="w-1/2 pl-2 ml-3 border-2 border-black rounded-lg" onChange={(e) => { setNewDegreeProgramName(e.target.value) }} value={newDegreeProgramName} /></p> */}
              <div className="flex flex-row">
                <p>DegreeProgram: </p>
                <div className="relative inline-block ml-3 w-1/2">
                  <input
                    placeholder="Department"
                    className={`w-full pl-2 border-2 border-black rounded-lg`}
                    onFocus={() => setNewBlocDegreeProgramDropdownVisible(true)}
                    onBlur={() => setNewBlocDegreeProgramDropdownVisible(false)}
                    value={newDegreeProgramDepartment}
                    readOnly
                  />
                  {newBlocDegreeProgram && (
                    <div className="w-full mt-2 bg-placebo-turquoise border-2 border-black rounded-lg text-center">
                      {newBlocDegreeProgram.yearLevel}
                      {newBlocDegreeProgram.name}
                    </div>
                  )}
                  <div
                    className={`absolute w-full z-10 bg-white border-2 border-black rounded-lg ${
                      !newBlocDegreeProgramDropdownVisible && "hidden"
                    }`}
                  >
                    {semesterDegreePrograms ? (
                      semesterDegreePrograms.map((degreeProgram) => {
                        return (
                          <p
                            key={degreeProgram}
                            className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center"
                            onMouseDown={() =>
                              setNewBlocDegreeProgram(degreeProgram)
                            }
                          >
                            {degreeProgram.yearLevel}
                            {degreeProgram.name}
                          </p>
                        );
                      })
                    ) : (
                      <p className="cursor-pointer hover:bg-placebo-turquoise rounded-lg text-center">
                        {" "}
                        None...{" "}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-row">
                <p>Bloc Number: </p>
                <div className="relative inline-block ml-3 w-1/2">
                  <input
                    placeholder="Bloc Number"
                    className={`w-full ml-5 pl-2 border-2 border-black rounded-lg`}
                    onChange={(e) => setNewBlocNumber(e.target.value)}
                    value={newBlocNumber}
                  />
                </div>
              </div>
            </div>
            {newBlocError && (
              <div className="bg-red-300 border-2 border-black p-3 mt-3">
                {newBlocError.error}
              </div>
            )}
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div>
              <div className="flex flex-row space-x-4">
                <button
                  className="w-20 h-10 border border-enamelled-jewel transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
                  onClick={async () => {
                    const res = await fetch(
                      `https://faculty-loading-system.vercel.app/api/bloc/${params.id}`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: newBlocDegreeProgram.name,
                          degreeProgram: newBlocDegreeProgram._id,
                          yearLevel: newBlocDegreeProgram.yearLevel,
                          bloc: newBlocNumber,
                          department: newBlocDegreeProgram.department,
                        }),
                      }
                    );
                    const newBlocData = await res.json();
                    if (newBlocData.error) {
                      return setNewBlocError(newBlocData);
                    } else {
                      dispatch({ type: "CREATE_BLOCS", payload: newBlocData });
                      setChosenStudents([...chosenStudents, newBlocData]);
                      setStudents([...students, newBlocData]);
                      return blocOnClose();
                    }
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    return blocOnClose();
                  }}
                  className="w-20 h-10 border border-enamelled-jewel transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
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

export default StudentMaker;
