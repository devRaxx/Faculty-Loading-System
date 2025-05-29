import { useState } from "react";
import { useFacultyContext } from "../../hooks/useFacultyContext";
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
import { useParams } from "react-router-dom";

const FacultyDetails = () => {
  const { selectedFaculty, selectedFacultySchedules, dispatch } =
    useSemesterContext();
  const [ALC, setALC] = useState("0");
  const [SLC, setSLC] = useState("0");
  const [RLC, setRLC] = useState("0");
  const [facultyError, setFacultyError] = useState(null);
  const params = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <table className="w-full border-2 border-enamelled-jewel">
        <thead>
          <tr className="bg-enamelled-jewel h-10 border-2 border-enamelled-jewel">
            <th className="font-bold text-white text-2xl">
              {selectedFaculty ? selectedFaculty.lastName : "Name"}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-2 border-enamelled-jewel h-10">
            <td>
              <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                <p>TLC</p>
                <p>
                  {selectedFacultySchedules &&
                  selectedFacultySchedules.length > 0
                    ? selectedFacultySchedules.reduce(
                        (totalUnits, sched) => totalUnits + sched.course.units,
                        0
                      )
                    : "0"}
                </p>
              </div>
            </td>
          </tr>
          <tr className="border-2 border-enamelled-jewel h-10">
            <td>
              <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                <p>ALC</p>
                <p>{selectedFaculty ? selectedFaculty.ALC : "0"}</p>
              </div>
            </td>
          </tr>
          <tr className="border-2 border-enamelled-jewel h-10">
            <td>
              <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                <p>SLC</p>
                <p>{selectedFaculty ? selectedFaculty.SLC : "0"}</p>
              </div>
            </td>
          </tr>
          <tr className="border-2 border-enamelled-jewel h-10">
            <td>
              <div className="flex flex-row justify-around text-enamelled-jewel text-lg">
                <p>RLC</p>
                <p>{selectedFaculty ? selectedFaculty.RLC : "0"}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="pt-5 flex justify-between items-center">
        <p className="text-2xl font-bold inline text-enamelled-jewel">
          Total Units :{" "}
          {selectedFaculty
            ? selectedFacultySchedules.reduce(
                (totalUnits, sched) => totalUnits + sched.course.units,
                0
              ) +
              selectedFaculty.ALC +
              selectedFaculty.SLC +
              selectedFaculty.RLC
            : "0"}
        </p>
        <button
          onClick={() => {
            selectedFaculty && setALC(selectedFaculty.ALC),
              setSLC(selectedFaculty.SLC),
              setRLC(selectedFaculty.RLC),
              onOpen();
          }}
          className="inline border-2 rounded-none text-enamelled-jewel border-enamelled-jewel text-2xl px-6 transition ease-in duration-200 hover:shadow-custom"
        >
          Edit
        </button>
      </div>
      {selectedFaculty && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <p>{selectedFaculty.lastName}'s LOAD</p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col space-y-2 ml-4">
                <div>
                  <p>TLC: </p>
                  <input
                    className="border-2 rounded-md text-center cursor-not-allowed bg-placebo-turquoise border-black"
                    value={selectedFacultySchedules.reduce(
                      (totalUnits, sched) => totalUnits + sched.course.units,
                      0
                    )}
                    readOnly
                  />
                </div>
                <div>
                  <p>ALC: </p>
                  <input
                    className="border-2 rounded-md text-center border-black"
                    onChange={(e) => {
                      setALC(e.target.value);
                    }}
                    value={ALC}
                  />
                </div>
                <div>
                  <p>SLC: </p>
                  <input
                    className="border-2 rounded-md text-center border-black"
                    onChange={(e) => {
                      setSLC(e.target.value);
                    }}
                    value={SLC}
                  />
                </div>
                <div>
                  <p>RLC: </p>
                  <input
                    className="border-2 rounded-md text-center border-black"
                    onChange={(e) => {
                      setRLC(e.target.value);
                    }}
                    value={RLC}
                  />
                </div>
                {facultyError && (
                  <div className="border-2 border-black p-2 bg-red-300">
                    {facultyError.error}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter justifyContent={"center"} alignItems={"center"}>
              <div>
                <div className="flex flex-row space-x-4">
                  <button
                    className="w-20 h-10 bg-placebo-turquoise border-2 border-enamelled-jewel"
                    onClick={async () => {
                      const res = await fetch(
                        `http://localhost:4000/api/faculty/${params.id}`,
                        {
                          method: "PATCH",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ALC: ALC,
                            SLC: SLC,
                            RLC: RLC,
                            _id: selectedFaculty._id,
                          }),
                        }
                      );
                      const newFacultyData = await res.json();
                      if (newFacultyData.error) {
                        setFacultyError(newFacultyData);
                        return;
                      } else {
                        dispatch({
                          type: "UPDATE_FACULTY",
                          payload: newFacultyData,
                        });
                        return onClose();
                      }
                    }}
                  >
                    SAVE
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="w-20 h-10 border-2 border-enamelled-jewel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default FacultyDetails;
