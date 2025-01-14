import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSemesterContext } from "../../hooks/useSemesterContext";
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

const filterRepeatedRooms = (arr) => {
  const roomsMap = {}; // Map to track unique colors

  // Filter the input array
  const filteredArray = arr.filter((obj) => {
    if (!roomsMap[obj.room.name]) {
      roomsMap[obj.room.name] = true; // Mark color as seen
      return true; // Include the object in the filtered array
    }
    return false; // Exclude the object if color is already seen
  });
  return filteredArray;
};

const RoomMaker = ({ semId, setMainRoom, mainRoom }) => {
  const { semesterRooms, dispatch } = useSemesterContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roomDisplay, setRoomDisplay] = useState(mainRoom);
  const [roomDropdownVisible, setRoomDropdownVisible] = useState(false);
  const [roomSearch, setRoomSearch] = useState("");
  const [filteredRoom, setFilteredRoom] = useState(semesterRooms);

  const [newRoomDropdownVisible, setNewRoomDropdownVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomBuilding, setNewRoomBuilding] = useState("");
  const [newRoomError, setNewRoomError] = useState(null);

  const params = useParams();

  useEffect(() => {
    const roomFilter = semesterRooms.filter((room) => {
      return (
        room.name && room.name.toLowerCase().includes(roomSearch.toLowerCase())
      );
    });
    setFilteredRoom(roomFilter);
  }, [roomSearch, semesterRooms]);

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-3xl font-bold">Room</p>
      <div className="flex flex-row space-x-2">
        <div className="relative w-1/3 inline-block">
          {/* Room Search Box */}
          <input
            className="outline-none border-2 border-black rounded-lg w-full h-9 text-lg text-left pl-1 placeholder-black"
            placeholder={"Room No."}
            onFocus={() => setRoomDropdownVisible(true)}
            onBlur={() => setRoomDropdownVisible(false)}
            onChange={(e) => {
              setRoomSearch(e.target.value);
            }}
            value={roomSearch}
          />

          {/* Room Dropdown contents */}
          <div
            className={`absolute flex flex-col w-full bg-white border-2 border-black z-10 ${
              !roomDropdownVisible && "hidden"
            }`}
          >
            {filteredRoom.length > 0 ? (
              filteredRoom.map((room, index) => {
                return (
                  <p
                    className="w-full text-center hover:bg-placebo-turquoise cursor-pointer"
                    onMouseDown={() => {
                      setRoomSearch(room.name);
                      setRoomDisplay(room);
                      setMainRoom(room);
                    }}
                    key={index}
                  >
                    {room.building} | {room.name}
                  </p>
                );
              })
            ) : (
              <p>Loading ...</p>
            )}
          </div>
        </div>

        {/* Room Location */}
        {roomDisplay ? (
          <>
            <div className="flex flex-row items-center space-x-2">
              <p className="text-lg">Room:</p>
              <div className="flex items-center border-2 text-lg border-enamelled-jewel bg-placebo-turquoise px-2 rounded-lg">
                {roomDisplay.name}
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <p className="text-lg">Building:</p>
              <div className="flex items-center border-2 text-lg border-enamelled-jewel bg-placebo-turquoise px-2 rounded-lg">
                {roomDisplay.building}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <p className="underline" onMouseDown={onOpen}>
        Create New Room
      </p>

      {/* New Room Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p>New Room</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-row justify-evenly">
              <input
                type="text"
                placeholder="Room Name"
                className="w-1/3 border-2 border-black rounded-lg pl-2 placeholder-black"
                onChange={(e) => {
                  setNewRoomName(e.target.value);
                }}
                value={newRoomName}
              />
              <div className="relative inline-block w-1/3">
                <input
                  type="text"
                  className="cursor-pointer w-full border-2 border-black rounded-lg pl-2 placeholder-black"
                  placeholder="Building"
                  onFocus={() => setNewRoomDropdownVisible(true)}
                  onBlur={() => setNewRoomDropdownVisible(false)}
                  value={newRoomBuilding}
                  readOnly
                />
                <div
                  className={`absolute flex flex-col bg-white w-full border-2 border-black rounded-lg ${
                    !newRoomDropdownVisible && "hidden"
                  }`}
                >
                  <p
                    onMouseDown={() => {
                      setNewRoomBuilding("CSM");
                    }}
                    className="hover:bg-placebo-turquoise rounded-lg cursor-pointer text-center"
                  >
                    CSM
                  </p>
                  <p
                    onMouseDown={() => {
                      setNewRoomBuilding("CHSS");
                    }}
                    className="hover:bg-placebo-turquoise rounded-lg cursor-pointer text-center"
                  >
                    CHSS
                  </p>
                  <p
                    onMouseDown={() => {
                      setNewRoomBuilding("SOM");
                    }}
                    className="hover:bg-placebo-turquoise rounded-lg cursor-pointer text-center"
                  >
                    SOM
                  </p>
                </div>
              </div>
            </div>
            {newRoomError && (
              <div className="mt-4 bg-red-300 border-2 border-black">
                {newRoomError.error}
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
                      `http://localhost:4000/api/room/${params.id}`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: newRoomName,
                          building: newRoomBuilding,
                        }),
                      }
                    );
                    const newRoom = await res.json();
                    if (newRoom.error) {
                      setNewRoomError(newRoom);
                    } else {
                      setRoomDisplay(newRoom);
                      setMainRoom(newRoom);
                      setRoomSearch("");
                      dispatch({ type: "CREATE_ROOM", payload: newRoom });
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

export default RoomMaker;
