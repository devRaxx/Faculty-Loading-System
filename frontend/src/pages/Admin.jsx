import { HiPlus } from "react-icons/hi";
import AdminNavBar from "../components/NavBar/AdminNavBar";
import UserList from "../components/UserList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAdminContext } from "../hooks/useAdminContext";

const Admin = () => {
  const navigate = useNavigate();
  const { users, dispatch } = useAdminContext();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [adminData, setAdminData] = useState({});
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserType, setNewUserType] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [errors, setErrors] = useState(null);
  const handleCreate = async () => {
    const res = await fetch("http://localhost:4000/api/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: newUserName,
        password: newUserPassword,
        userType: newUserType,
      }),
    });
    const data = await res.json();
    if (data.errors) {
      setErrors({ message: data.errors.password });
    } else {
      dispatch({ type: "CREATE_USER", payload: data });
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://localhost:4000/api/auth/user", {
          method: "GET",
          credentials: "include",
        });
        const admin = await res.json();
        if (admin.userType == "Admin") {
          setAdminData(admin);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching Admin data:", error);
      }
    })();
  }, []);
  return (
    <>
      <AdminNavBar />
      <div className="w-screen flex flex-col items-center p-10 space-y-5">
        {/* Admin Details */}
        <div className="w-11/12 min-h-min bg-placebo-turquoise flex flex-row p-5 border-2 border-enamelled-jewel rounded-md text-2xl shadow-custom">
          <div className="flex flex-col w-1/2 justify-start text-enamelled-jewel font-bold">
            <p>Name : {adminData.userName}</p>
            <p>Account Type: {adminData.userType}</p>
          </div>
          <div className="flex justify-end w-1/2 text-enamelled-jewel font-bold">
            <p> Employee Number: 2021-2021 </p>
          </div>
        </div>

        {/* Configuration Buttons */}
        <div>
          <button
            onClick={onOpen}
            className="flex items-center font-bold justify-center text-xl border-2 border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-48 h-11 transition ease-in duration-200 hover:shadow-custom"
          >
            <HiPlus />
            Create User
          </button>
        </div>

        {/* User List */}
        <div className="w-8/12">
          <UserList />
          {isLoading && (
            <div className="mt-24">
              <p className="text-8xl font-bold">Loading ...</p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p>New User Details</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col space-y-2">
              <div>
                User Name:
                <input
                  onChange={(e) => {
                    setNewUserName(e.target.value);
                  }}
                  value={newUserName}
                  className="w-1/2 border-2 ml-3 border-black rounded-md pl-2"
                />
              </div>
              <div>
                Password:
                <input
                  onChange={(e) => {
                    setNewUserPassword(e.target.value);
                  }}
                  value={newUserPassword}
                  className="w-1/2 border-2 ml-6 border-black rounded-md pl-2"
                />
              </div>
              <div>
                User Type:
                <div className="relative inline-block w-1/2  ml-5">
                  <input
                    value={newUserType}
                    className={`w-full border-2 border-black rounded-md pl-2`}
                    onFocus={() => {
                      setDropdownVisible(true);
                    }}
                    onBlur={() => setDropdownVisible(false)}
                    readOnly
                  />
                  <div
                    className={`absolute w-full bg-white border-2 border-black rounded-md ${
                      !dropdownVisible && "hidden"
                    }`}
                  >
                    <p
                      className="text-center cursor-pointer hover:bg-placebo-turquoise"
                      onMouseDown={() => {
                        setNewUserType("Admin");
                      }}
                    >
                      Admin
                    </p>
                    <p
                      className="text-center cursor-pointer hover:bg-placebo-turquoise"
                      onMouseDown={() => {
                        setNewUserType("Super User");
                      }}
                    >
                      Super User
                    </p>
                    <p
                      className="text-center cursor-pointer hover:bg-placebo-turquoise"
                      onMouseDown={() => {
                        setNewUserType("User");
                      }}
                    >
                      User
                    </p>
                  </div>
                </div>
              </div>
              {errors && (
                <div className="bg-red-300 p-2 w-full h-full border border-black rounded-md">
                  {errors.message}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div>
              <div className="flex flex-row space-x-4">
                <button
                  className="w-20 h-10 bg-placebo-turquoise border-2 border-enamelled-jewel"
                  onClick={() => {
                    if (!newUserName || !newUserPassword || !newUserType) {
                      setErrors({
                        message:
                          "Please fill in all necessary fields for user creation",
                      });
                    } else {
                      handleCreate();
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

export default Admin;
