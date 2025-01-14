import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
const filterRepeatedCourses = (arr) => {
  const coursesMap = {}; // Map to track unique colors

  // Filter the input array
  const filteredArray = arr.filter((obj) => {
    if (!coursesMap[`${obj.course.code}-${obj.course.type}`]) {
      coursesMap[`${obj.course.code}-${obj.course.type}`] = true; // Mark color as seen
      return true; // Include the object in the filtered array
    }
    return false; // Exclude the object if color is already seen
  });
  return filteredArray;
};

const CourseMaker = ({
  setMainCourse,
  mainCourse,
  setCourseType,
  courseType,
  students,
  setStudents,
}) => {
  const { semesterCourses, dispatch } = useSemesterContext();
  const [initialCourse, setInitialCourse] = useState(null);

  const [courseDisplay, setCourseDisplay] = useState(mainCourse);
  const [courseDropdownVisible, setcourseDropdownVisible] = useState(false);
  const [newCourseTypeDropdownVisible, setNewCourseTypeDropdownVisible] =
    useState(false);
  const [newCourseDeptDropdownVisible, setNewCourseDeptDropdownVisible] =
    useState(false);

  const [courseList, setCourseList] = useState(semesterCourses);
  const [filteredCourse, setFilteredCourse] = useState(semesterCourses);

  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseType, setNewCourseType] = useState("");
  const [newCourseUnits, setNewCourseUnits] = useState("");
  const [newCourseDept, setNewCourseDept] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseError, setNewCourseError] = useState(null);
  const params = useParams();
  // Search Box Input
  const [courseSearch, setCourseSearch] = useState("");
  const [placeholder, setPlaceholder] = useState("Course Code");

  const {
    isOpen: isWarningModalOpen,
    onOpen: onWarningModalOpen,
    onClose: onWarningModalClose,
  } = useDisclosure();
  const {
    isOpen: isNewCourseModalOpen,
    onOpen: onNewCourseModalOpen,
    onClose: onNewCourseModalClose,
  } = useDisclosure();

  useEffect(() => {
    const courseFilter = semesterCourses.filter((course) => {
      return (
        course.code &&
        course.name &&
        (course.type + " " + course.code + " - " + course.name)
          .toLowerCase()
          .includes(courseSearch.toLowerCase())
      );
    });
    setFilteredCourse(courseFilter);
  }, [courseSearch, semesterCourses]);
  return (
    <div className="w-full">
      <p className="text-3xl font-semibold cursor-pointer">Course</p>
      <div className="flex flex-wrap flex-row space-x-4">
        <div className="w-3/6 relative inline-block">
          {/* Course Search Box */}
          <input
            className="outline-none border-2 h-9 text-lg border-black rounded-lg pl-2 w-full placeholder-black"
            onFocus={(e) => {
              setcourseDropdownVisible(true);
              setCourseSearch(e.target.value);
            }}
            onBlur={() => setcourseDropdownVisible(false)}
            onChange={(e) => (
              setCourseType({ type: courseType, status: "Unchanged" }),
              setCourseSearch(e.target.value)
            )}
            placeholder={placeholder}
            type="text"
            value={courseSearch}
          />

          {/* Course Dropdown */}
          <div
            className={`absolute flex flex-col w-full bg-white border-2 border-black z-10 ${
              !courseDropdownVisible && "hidden"
            }`}
          >
            {filteredCourse.length > 0 ? (
              filteredCourse.map((course, index, self) => {
                return (
                  <p
                    className="hover:bg-placebo-turquoise hover:cursor-pointer truncate"
                    key={index}
                    onMouseDown={() => {
                      if (
                        courseDisplay &&
                        students.length > 0 &&
                        course.type.toString() !== courseDisplay.type.toString()
                      ) {
                        setInitialCourse(course);
                        return onWarningModalOpen();
                      } else {
                        setCourseSearch("");
                        setCourseDisplay(course);
                        setMainCourse(course);
                        setCourseType({
                          type: course.type,
                          status:
                            courseType == course.type ? "Unchanged" : "Changed",
                        });
                        setPlaceholder(course.code);
                      }
                    }}
                  >
                    <strong className="text-enamelled-jewel">
                      {course.type}
                    </strong>{" "}
                    <strong>{course.code}</strong> - {course.name}
                  </p>
                );
              })
            ) : (
              <a>Loading ...</a>
            )}
          </div>
        </div>
        <div className="flex flex-col w-72 space-y-4">
          <div className="flex flex-row justify-between w-full">
            {/* Dispaly Course Type */}
            <div className="w-20">
              <input
                className={`outline-none border-2 border-black rounded-lg w-full h-9 text-lg hover:cursor-not-allowed bg-placebo-turquoise placeholder-black text-center ${
                  !courseDisplay && "bg-white"
                }`}
                placeholder="Type"
                type="text"
                value={courseDisplay ? courseDisplay.type : ""}
                readOnly
              />
            </div>

            {/* Display Course Units */}
            <div className="w-20">
              <input
                className={`outline-none border-2 border-black rounded-lg w-full h-9 text-lg hover:cursor-not-allowed bg-placebo-turquoise placeholder-black text-center ${
                  !courseDisplay && "bg-white"
                }`}
                placeholder="Units"
                type="text"
                value={courseDisplay ? courseDisplay.units : ""}
                readOnly
              />
            </div>

            {/* Display Course Department */}
            <div className="w-20">
              <input
                className={`outline-none border-2 border-black rounded-lg w-full h-9 text-lg hover:cursor-not-allowed bg-placebo-turquoise placeholder-black text-center ${
                  !courseDisplay && "bg-white"
                }`}
                placeholder="Dept."
                type="text"
                value={courseDisplay ? courseDisplay.department : ""}
                readOnly
              />
            </div>
          </div>
          <div>
            <textarea
              className={`outline-none border-2 border-black rounded-lg w-full h-16 resize-none text-lg hover:cursor-not-allowed bg-placebo-turquoise placeholder-black text-left pl-1 ${
                !courseDisplay && "bg-white"
              }`}
              placeholder="Course Description"
              type="text"
              value={courseDisplay ? courseDisplay.name : ""}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Create New Non-Existing Course */}
      <div>
        <p onMouseDown={() => onNewCourseModalOpen()} className="underline">
          Create New Course
        </p>
      </div>

      {/* Warning modal for changing course type */}
      <Modal
        isOpen={isWarningModalOpen}
        onClose={onWarningModalClose}
        size={"2xl"}
      >
        <ModalContent
          style={{ border: "2px solid #035C65", borderColor: "#035C65" }}
        >
          <ModalBody>
            <p className="text-2xl text-red-600">
              <strong>Warning!</strong>
            </p>
            <p className="text-black">
              Changing a course from <strong>LEC</strong> to{" "}
              <strong>LAB</strong> or <strong>LAB</strong> to{" "}
              <strong>LEC</strong> will reset the Students List that you
              inputted (if there's any) for this schedule
            </p>
            <br />
            <p>Reason: </p>
            <p>
              <strong>LEC</strong> only accepts specific degree program
            </p>
            <p>
              <strong>LAB</strong> only accepts specific blocs
            </p>
            <p>
              <strong>0</strong> only accepts specific degree program
            </p>
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div>
              <p>Do you wish to proceed?</p>
              <div className="flex flex-row space-x-4">
                <button
                  className="w-20 h-10 bg-placebo-turquoise border-2 border-enamelled-jewel"
                  onClick={async () => {
                    if (isNewCourseModalOpen) {
                      const res = await fetch(
                        "http://localhost:4000/api/course/",
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            semester: params.id,
                            name: newCourseDescription,
                            code: newCourseCode,
                            type: newCourseType,
                            units: newCourseUnits,
                            department: newCourseDept,
                          }),
                        }
                      );
                      const newCourseData = await res.json();
                      if (newCourseData.error) {
                        setNewCourseError(newCourseData);
                        return onWarningModalClose();
                      } else {
                        setStudents([]);
                        setCourseSearch("");
                        setCourseDisplay(newCourseData);
                        setMainCourse(newCourseData);
                        setCourseType({
                          type: initialCourse.type,
                          status: "Changed",
                        });
                        dispatch({
                          type: "CREATE_COURSE",
                          payload: newCourseData,
                        });
                        onWarningModalClose();
                        return onNewCourseModalClose();
                      }
                    }
                    setStudents([]);
                    setCourseSearch("");
                    setCourseDisplay(initialCourse);
                    setMainCourse(initialCourse);
                    setCourseType({
                      type: initialCourse.type,
                      status: "Changed",
                    });
                    setcourseDropdownVisible(true);
                    return onWarningModalClose();
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setcourseDropdownVisible(true);
                    return onWarningModalClose();
                  }}
                  className="w-20 h-10 border-2 border-enamelled-jewel"
                >
                  No
                </button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* New Course */}
      <Modal
        isOpen={isNewCourseModalOpen}
        onClose={onNewCourseModalClose}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent isCentered={true}>
          <ModalHeader>
            <p>New Course</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col w-full space-y-4 items-center">
              <div className="flex flex-row justify-between w-96">
                {/* Course Code */}
                <div className="w-20">
                  <input
                    className={`outline-none border-2 border-black rounded-lg w-full h-9 text-lg text-center bg-white placeholder-black`}
                    onChange={(e) => {
                      setNewCourseCode(e.target.value);
                    }}
                    placeholder="Code"
                    type="text"
                    value={newCourseCode}
                  />
                </div>
                {/* Dispaly Course Type */}
                <div className="w-20 relative inline-block">
                  <input
                    className={`outline-none cursor-pointer border-2 border-black rounded-lg w-full h-9 text-lg text-center bg-white placeholder-black`}
                    onFocus={() => setNewCourseTypeDropdownVisible(true)}
                    onBlur={() => setNewCourseTypeDropdownVisible(false)}
                    onChange={(e) => {
                      setNewCourseType(e.target.value);
                    }}
                    placeholder="Type"
                    type="text"
                    value={newCourseType}
                    readOnly
                  />

                  <div
                    className={`absolute flex flex-col w-full items-center bg-white border-2 border-black rounded-lg ${
                      !newCourseTypeDropdownVisible && "hidden"
                    }`}
                  >
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseType("LEC");
                      }}
                    >
                      LEC
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseType("LAB");
                      }}
                    >
                      LAB
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseType("NA");
                      }}
                    >
                      NA
                    </p>
                  </div>
                </div>

                {/* Display Course Units */}
                <div className="w-20">
                  <input
                    className={`outline-none border-2 border-black rounded-lg w-full h-9 text-lg text-center bg-white placeholder-black`}
                    onChange={(e) => {
                      setNewCourseUnits(e.target.value);
                    }}
                    placeholder="Units"
                    type="number"
                    value={newCourseUnits}
                  />
                </div>

                {/* Display Course Department */}
                <div className="w-20 relative inline-block">
                  <input
                    className={`outline-none border-2 border-black rounded-lg w-full h-9 text-lg text-center bg-white placeholder-black`}
                    onFocus={() => setNewCourseDeptDropdownVisible(true)}
                    onBlur={() => setNewCourseDeptDropdownVisible(false)}
                    onChange={(e) => {
                      setNewCourseDept(e.target.value);
                    }}
                    placeholder="Dept."
                    type="text"
                    value={newCourseDept}
                    readOnly
                  />
                  <div
                    className={`absolute flex flex-col w-full items-center bg-white border-2 border-black rounded-lg ${
                      !newCourseDeptDropdownVisible && "hidden"
                    }`}
                  >
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseDept("DMPCS");
                      }}
                    >
                      DMPCS
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseDept("DFSC");
                      }}
                    >
                      DFSC
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseDept("DBSES");
                      }}
                    >
                      DBSES
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseDept("HSS");
                      }}
                    >
                      HSS
                    </p>
                    <p
                      className="cursor-pointer hover:bg-placebo-turquoise w-full rounded-lg text-center"
                      onMouseDown={() => {
                        setNewCourseDept("SOM");
                      }}
                    >
                      SOM
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <textarea
                  className={`outline-none border-2 border-black rounded-lg w-96 h-16 resize-none text-lg text-left pl-1 bg-white placeholder-black`}
                  onChange={(e) => {
                    setNewCourseDescription(e.target.value);
                  }}
                  placeholder="Course Description"
                  type="text"
                  value={newCourseDescription}
                />
              </div>
            </div>
            <div>
              {newCourseError && newCourseError.error}
              {newCourseError &&
                newCourseError.emptyFields &&
                newCourseError.emptyFields}
            </div>
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div>
              <div className="flex flex-row space-x-4">
                <button
                  className="w-20 h-10border border-enamelled-jewel transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
                  onClick={async () => {
                    if (
                      courseDisplay &&
                      students.length > 0 &&
                      newCourseType.toString() !== courseDisplay.type.toString()
                    ) {
                      setInitialCourse({
                        semester: params.id,
                        name: newCourseDescription,
                        code: newCourseCode,
                        type: newCourseType,
                        units: newCourseUnits,
                        department: newCourseDept,
                      });
                      return onWarningModalOpen();
                    } else {
                      setCourseSearch("");
                      setCourseDisplay({
                        type: newCourseType,
                        units: newCourseUnits,
                        department: newCourseDept,
                        name: newCourseDescription,
                      });
                      const res = await fetch(
                        "http://localhost:4000/api/course/",
                        {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            semester: params.id,
                            name: newCourseDescription,
                            code: newCourseCode,
                            type: newCourseType,
                            units: newCourseUnits,
                            department: newCourseDept,
                          }),
                        }
                      );
                      const newCourseData = await res.json();
                      if (newCourseData.error) {
                        setNewCourseError(newCourseData);
                      } else {
                        setMainCourse(newCourseData);
                        setCourseType({
                          type: newCourseData.type,
                          status:
                            courseType == newCourseData.type
                              ? "Unchanged"
                              : "Changed",
                        });
                        dispatch({
                          type: "CREATE_COURSE",
                          payload: newCourseData,
                        });
                        return onNewCourseModalClose();
                      }
                    }
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setNewCourseType("");
                    setNewCourseUnits("");
                    setNewCourseDept("");
                    setNewCourseDescription("");
                    return onNewCourseModalClose();
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

export default CourseMaker;
