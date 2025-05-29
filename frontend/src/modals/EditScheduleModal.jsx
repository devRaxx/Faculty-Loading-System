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
import { FaXmark } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import ScheduleMaker from "../components/DetailsMaker/WeeklyScheduleMaker";
import CourseMaker from "../components/DetailsMaker/CourseMaker";
import FacultyMaker from "../components/DetailsMaker/FacultyMaker";
import StudentMaker from "../components/DetailsMaker/StudentMaker";
import RemarksMaker from "../components/DetailsMaker/RemarksMaker";
import RoomMaker from "../components/DetailsMaker/RoomMaker";
import SectionMaker from "../components/DetailsMaker/SectionMaker";
import { useSchedulesContext } from "../hooks/useScheduleContext";
import { useSemesterContext } from "../hooks/useSemesterContext";
import { useParams } from "react-router-dom";

const EditScheduleModal = ({ onClose, isOpen }) => {
  const {
    editSchedule,
    semesterFaculties,
    semesterDegreePrograms,
    semesterBlocs,
    dispatch,
  } = useSemesterContext();
  const [course, setCourse] = useState(editSchedule.course);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(editSchedule.room);
  const [faculty, setFaculty] = useState(editSchedule.faculty);
  const [students, setStudents] = useState(editSchedule.students);
  const [remarks, setRemarks] = useState(editSchedule.remarks);
  const [weeklySchedule, setWeeklySchedule] = useState(editSchedule.schedule);
  const [courseType, setCourseType] = useState({
    type: editSchedule.course.type,
    status: "Unchanged",
  });

  const params = useParams();
  const commonModalButtonStyle = {
    borderRadius: "50%",
    background: "#035C65",
    cursor: "pointer",
    borderColor: "transparent",
    marginTop: "12px",
  };

  return (
    <Modal isOpen={isOpen} size={"3xl"} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        style={{ border: "2px solid #035C65", borderColor: "#035C65" }}
      >
        <h1 className="text-5xl text-enamelled-jewel font-bold bg-placebo-turquoise border-b-2 mb-4 border-enamelled-jewel rounded-tl-md rounded-tr-md pl-5 py-2">
          Edit Schedule:
        </h1>
        <ModalCloseButton
          size="sm"
          style={{
            ...commonModalButtonStyle,
            marginRight: "30px",
            pointerEvents: "none",
            color: "#035C65",
          }}
        />
        <ModalCloseButton
          size="sm"
          style={{
            ...commonModalButtonStyle,
            marginRight: "60px",
            pointerEvents: "none",
            color: "#035C65",
          }}
        />
        <ModalCloseButton
          size="sm"
          style={{ ...commonModalButtonStyle, color: "white" }}
        />
        <ModalBody>
          <div className="flex justify-center">
            <div className="flex flex-col space-y-3 w-full px-10">
              {/* Course */}
              <CourseMaker
                setMainCourse={setCourse}
                mainCourse={course}
                setCourseType={setCourseType}
                courseType={courseType.type}
                students={students}
                setStudents={setStudents}
              />

              {/* Schedule */}
              <div>
                <p className="text-3xl font-bold">Schedule</p>
                <div className="flex flex-wrap flex-col space-y-4">
                  {weeklySchedule &&
                    weeklySchedule.map((time, index, self) => (
                      <div className="flex flex-row" key={index}>
                        <ScheduleMaker
                          key={index}
                          edit={true}
                          index={index}
                          weeklySchedule={time}
                          setWeeklySchedule={(updatedSchedule) => {
                            const newWeeklySchedule = [...weeklySchedule]; // Create a new reference
                            newWeeklySchedule[index] = updatedSchedule; // Update the specific index
                            setWeeklySchedule(newWeeklySchedule); // Set the updated array as state
                          }}
                        />
                        {index > 0 && (
                          <div className="pl-2 pt-3">
                            <FaXmark
                              className="text-lg cursor-pointer hover:bg-red-300 hover:rounded-lg"
                              onMouseDown={() => {
                                const newWeeklySchedule = weeklySchedule.filter(
                                  (_, i) => i !== index
                                );

                                setWeeklySchedule(newWeeklySchedule);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Add more section */}
                <p
                  className={`underline px-1 mt-2 max-w-max cursor-pointer ${
                    weeklySchedule && weeklySchedule.length == 3 && "hidden"
                  }`}
                  onMouseDown={() => {
                    setWeeklySchedule((prev) => [...prev, {}]);
                  }}
                >
                  Add Schedule
                </p>
              </div>

              {/* Room */}
              <RoomMaker setMainRoom={setRoom} mainRoom={room} />

              {/* Faculty & Students */}
              <div className="flex flex-row justify-between">
                {/* Faculty */}
                <FacultyMaker
                  setMainFaculty={setFaculty}
                  mainFaculty={faculty}
                  faculties={semesterFaculties}
                />

                {/* Students */}
                <StudentMaker
                  setStudents={setStudents}
                  students={students}
                  courseType={courseType}
                  degreePrograms={semesterDegreePrograms}
                  blocs={semesterBlocs}
                />
              </div>

              {/* Remarks */}
              <RemarksMaker mainRemarks={remarks} setMainRemarks={setRemarks} />

              {/* Error Message */}
              {error && (
                <div className="bg-red-300 p-3 border-2 border-black rounded-lg">
                  {error.error}
                  <br />
                  {error.emptyFields ? (
                    error.emptyFields.map((field) => {
                      return <strong key={field}>{field + ", "}</strong>;
                    })
                  ) : (
                    <strong></strong>
                  )}
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter justifyContent={"center"} alignItems={"center"}>
          {console.log("3")}
          <div className="flex flex-row space-x-4 mt-6">
            <button
              className="w-20 h-10 border border-enamelled-jewel text-enamelled-jewel font-semibold transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
              onClick={async () => {
                const res = await fetch(
                  `http://localhost:4000/api/schedule/${params.id}`,
                  {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      _id: editSchedule._id,
                      semester: params.id,
                      course: course._id,
                      weeklySchedule: weeklySchedule,
                      room: room._id,
                      faculty: faculty._id,
                      students: students.map((e) => {
                        return e._id;
                      }),
                      remarks: remarks,
                    }),
                  }
                );
                const responseData = await res.json();
                if (responseData.error) {
                  setError(responseData);
                } else {
                  dispatch({
                    type: "UPDATE_SCHEDULE",
                    payload: responseData[0],
                  });
                  onClose();
                }
              }}
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="w-20 h-10 border border-enamelled-jewel text-enamelled-jewel font-semibold transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
            >
              Cancel
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditScheduleModal;
