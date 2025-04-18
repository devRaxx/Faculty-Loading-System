import { useEffect, useMemo, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useDisclosure } from "@chakra-ui/react";
import { useParams, useSearchParams } from "react-router-dom";
import EditFacultyScheduleModal from "../../modals/EditFacultyScheduleModal";
import { useSemesterContext } from "../../hooks/useSemesterContext";
import { PiCopy } from "react-icons/pi";

const BlocSchedList = ({ edit }) => {
  const {
    semesterSchedules,
    selectedFacultySchedules,
    selectedFacultyFilteredSchedules,
    dispatch,
  } = useSemesterContext();
  const [queryParameters] = useSearchParams();
  const [editSched, setEditSched] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    (function () {
      setIsLoading(true);
      dispatch({
        type: "FILTER_SELECTED_FACULTY_SCHEDULE_DEPARTMENT",
        payload: queryParameters.getAll("filter"),
      });
      setIsLoading(false);
    })();
  }, [queryParameters]);

  return (
    <>
      <table className="w-5/6 border-separate border-spacing-0">
        <thead className="h-12">
          <tr className="shadow-custom rounded-md text-lg">
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel rounded-tl-md rounded-bl-md border-r-0">
              Course Code
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Course Description
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Class
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Section
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Time
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Day
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Room
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Units
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              Students
            </th>
            <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel border-x-0 ">
              FIC
            </th>
            <th
              className={`bg-placebo-turquoise border border-collapse border-enamelled-jewel text-enamelled-jewel ${
                edit ? "border-x-0" : "rounded-tr-md rounded-br-md border-l-0"
              }`}
            >
              Remarks
            </th>
            {edit && (
              <th className="bg-placebo-turquoise border border-collapse border-enamelled-jewel rounded-tr-md rounded-br-md border-l-0">
                Delete
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {selectedFacultyFilteredSchedules &&
            selectedFacultyFilteredSchedules.length > 0 &&
            selectedFacultyFilteredSchedules.map(
              ({
                course,
                faculty,
                room,
                schedule,
                section,
                remarks,
                students,
                _id,
              }) => {
                return (
                  <tr
                    className="h-12 hover:bg-placebo-turquoise"
                    key={_id}
                    onMouseDown={() => {
                      edit &&
                        (dispatch({
                          type: "EDIT_FACULTY_SCHEDULE",
                          payload: {
                            _id: _id,
                            course: course,
                            faculty: faculty,
                            room: room,
                            students: students,
                            remarks: remarks,
                            schedule: schedule,
                          },
                        }),
                        onOpen());
                    }}
                  >
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {course.code}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {course.name}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {course.type}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {schedule.map(({ section }) => {
                        return section;
                      })}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {schedule.map((time) => {
                        return (
                          Object.keys(time).length !== 0 && (
                            <p>{time.startTime + " - " + time.endTime}</p>
                          )
                        );
                      })}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {schedule.map((time, index) => {
                        return (
                          <p key={index}>
                            {Object.keys(time).length !== 0 &&
                              time.day.map((e) => {
                                return e;
                              })}
                          </p>
                        );
                      })}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {room.building + " " + room.name}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {course.units}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {students.map(({ name, bloc, yearLevel }, index) => {
                        return (
                          <p key={index}>
                            {yearLevel + name + `${bloc ? " - " + bloc : ""}`}
                          </p>
                        );
                      })}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {faculty.lastName}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {remarks}
                    </td>
                    <td className="border border-collapse border-black border-opacity-30 border-b-1 border-x-0 border-t-0">
                      {edit && <IoTrashOutline />}
                    </td>
                  </tr>
                );
              }
            )}
        </tbody>
      </table>
      {isLoading && (
        <div className="mt-24">
          <p className="text-8xl font-bold">Loading ...</p>
        </div>
      )}
      {!isLoading &&
        (!semesterSchedules.length ||
          (selectedFacultyFilteredSchedules &&
            selectedFacultyFilteredSchedules.length === 0)) && (
          <div className="mt-24 flex flex-col items-center justify-center">
            <p className="text-7xl font-bold text-enamelled-jewel">
              Start Adding the List
            </p>
            <p className="text-3xl p-2 font-light italic text-enamelled-jewel">
              or
            </p>
            <button className="flex items-center justify-center w-96 h-20 border text-xl font-semibold text-enamelled-jewel border-enamelled-jewel rounded-md bg-placebo-turquoise transition ease-in duration-200 hover:shadow-custom">
              <PiCopy /> Copy Alpha List
            </button>
          </div>
        )}

      {edit && (
        <EditFacultyScheduleModal
          semester={params.id}
          onClose={onClose}
          isOpen={isOpen}
        />
      )}
    </>
  );
};

export default BlocSchedList;
