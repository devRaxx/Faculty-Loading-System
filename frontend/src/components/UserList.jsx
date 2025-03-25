import { useState } from "react";
import { useAdminContext } from "../hooks/useAdminContext";
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
const UserList = () => {
  const { users, selectedUser, dispatch } = useAdminContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserPassword, setSelectedUserPassword] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState(null);
  return (
    <>
      <table className="border-separate border-spacing-0 w-full">
        <thead className="h-12">
          <tr>
            <th className="bg-blizzard text-left font-bold border-black border-b">
              Name
            </th>
            <th className="bg-blizzard text-left font-bold border-black border-b">
              Type
            </th>
          </tr>
        </thead>
        <tbody>
          {users ? (
            users.map((user) => {
              return (
                <tr
                  className="h-12 hover:bg-placebo-turquoise cursor-pointer"
                  key={user._id}
                  onMouseDown={() => {
                    dispatch({ type: "SELECT_USER", payload: user });
                    setSelectedUserName(user.userName);
                    setSelectedUserPassword(user.password);
                    setSelectedUserType(user.userType);
                    return onOpen();
                  }}
                >
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {user.userName}
                  </td>
                  <td className="border border-collapse border-enamelled-jewel border-b-1 border-x-0 border-t-0">
                    {user.userType}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr></tr>
          )}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalContent>
          <ModalHeader>
            <p>{selectedUser.userName}'s Details</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col space-y-2">
              <div>
                User Name:
                <input
                  onChange={(e) => {
                    setSelectedUserName(e.target.value);
                  }}
                  value={selectedUserName}
                  className="w-1/2 border-2 ml-3 border-black rounded-md pl-2"
                />
              </div>
              <div>
                Password:
                <input
                  onChange={(e) => {
                    setSelectedUserPassword(e.target.value);
                  }}
                  value={selectedUserPassword}
                  className="w-1/2 border-2 ml-6 border-black rounded-md pl-2"
                />
              </div>
              <div>
                User Type:
                <div className="relative inline-block w-1/2  ml-5">
                  <input
                    value={selectedUserType}
                    className={`w-full border-2 border-black rounded-md pl-2 ${
                      selectedUser.userType == "Admin" && "cursor-not-allowed"
                    }`}
                    onFocus={() => {
                      setDropdownVisible(true);
                    }}
                    onBlur={() => setDropdownVisible(false)}
                    readOnly
                  />
                  <div
                    className={`absolute w-full bg-white border-2 border-black rounded-md ${
                      !dropdownVisible && "hidden"
                    } ${selectedUser.userType == "Admin" && "hidden"}`}
                  >
                    <p
                      className="text-center cursor-pointer hover:bg-placebo-turquoise"
                      onMouseDown={() => {
                        setSelectedUserType("Admin");
                      }}
                    >
                      Admin
                    </p>
                    <p
                      className="text-center cursor-pointer hover:bg-placebo-turquoise"
                      onMouseDown={() => {
                        setSelectedUserType("Super User");
                      }}
                    >
                      Super User
                    </p>
                    <p
                      className="text-center cursor-pointer hover:bg-placebo-turquoise"
                      onMouseDown={() => {
                        setSelectedUserType("User");
                      }}
                    >
                      User
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div>
              <div className="flex flex-row space-x-4">
                <button
                  className="w-20 h-10 bg-placebo-turquoise border-2 border-enamelled-jewel"
                  onClick={async () => {
                    const res = await fetch(
                      `http://localhost:4000/api/auth/update/`,
                      {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          userName: selectedUserName,
                          password: selectedUserPassword,
                          userType: selectedUserType,
                          _id: selectedUser._id,
                        }),
                      }
                    );
                    const newUserData = await res.json();
                    if (newUserData.error) {
                      setError(newUserData);
                      return;
                    } else {
                      dispatch({ type: "UPDATE_USER", payload: newUserData });
                      return onClose();
                    }
                  }}
                >
                  Save
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
    </>
  );
};

export default UserList;
