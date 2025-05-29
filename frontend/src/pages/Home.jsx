import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { FaRegFileAlt } from "react-icons/fa";
import { FaRegFile } from "react-icons/fa";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { HiPlus } from "react-icons/hi";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoTrashOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa6";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const Home = () => {
  const navigate = useNavigate();
  const [semData, setSemData] = useState(null);
  const [firstYear, setFirstYear] = useState("");
  const [secondYear, setSecondYear] = useState("");
  const [semester, setSemester] = useState("");
  const [userData, setUserData] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState(false);
  const [urlParams] = useSearchParams();

  const handleDeleteClick = (semId) => {
    const payload = {
      id: semId,
    };
    (async function () {
      try {
        const res = await fetch("http://localhost:4000/api/semester", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log(data);

        // Update UI by removing deleted semester
        setSemData((prevData) => prevData.filter((sem) => sem._id !== semId));
      } catch (err) {
        console.error("Error deleting semester:", err);
      }
    })();
  };

  const handleEditClick = () => {
    setEditing(!editing);
  };

  const commonModalButtonStyle = {
    borderRadius: "50%",
    background: "#035C65",
    cursor: "pointer",
    borderColor: "transparent",
    marginTop: "12px",
  };

  const handleSubmit = (fyear, syear, sem) => {
    const payload = {
      semesterType: sem,
      AY: `${fyear}-${syear}`,
      userId: userData.userId,
    };
    (async function () {
      const res = await fetch("http://localhost:4000/api/semester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSemData([...semData, data]);
      onClose(); // close modal after adding
    })();
  };

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://localhost:4000/api/auth/user", {
          method: "GET",
          credentials: "include",
        });
        const user = await res.json();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch("http://localhost:4000/api/semester", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setSemData(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <NavBar />
      <div className="flex flex-row justify-center space-x-4 py-7">
        {userData.userType === "Super User" && (
          <>
            {editing ? (
              <>
                <button
                  className="flex items-center font-semibold justify-center text-xl border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-32 h-11 transition ease-in duration-200 hover:shadow-custom"
                  onClick={handleEditClick}
                >
                  Cancel
                </button>
                <button className="flex items-center font-semibold justify-center text-xl border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-32 h-11 transition ease-in duration-200 hover:shadow-custom">
                  Save
                </button>
              </>
            ) : (
              !urlParams.get("copy") && (
                <>
                  <button
                    className="flex items-center font-semibold justify-center text-xl border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-32 h-11 transition ease-in duration-200 hover:shadow-custom"
                    onClick={onOpen}
                  >
                    <HiPlus />
                    New File
                  </button>
                  <button
                    className="flex items-center font-semibold justify-center text-xl border-enamelled-jewel bg-placebo-turquoise text-enamelled-jewel w-32 h-11 transition ease-in duration-200 hover:shadow-custom"
                    onClick={handleEditClick}
                  >
                    <HiOutlinePencilSquare />
                    Edit
                  </button>
                </>
              )
            )}
          </>
        )}
      </div>

      <div className="mx-auto w-5/6">
        <table className="w-full border-b">
          <thead className="border-b-2 border-black text-left">
            <tr>
              <th className="flex font-bold text-2xl items-center text-black p-2">
                <FaRegFile />
                Name
              </th>
              <th className="text-black font-bold text-2xl p-2">Modified By</th>
              <th className="text-black font-bold text-2xl p-2">
                Date Modified
              </th>
              {urlParams.get("copy") && (
                <th className="text-black font-bold text-2xl p-2"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {semData ? (
              semData.map((sem, index) => (
                <tr
                  className={`border-b cursor-pointer ${
                    index === selectedRow ? "bg-placebo-turquoise" : ""
                  }`}
                  key={sem._id}
                  onMouseEnter={() => handleRowClick(index)}
                  onMouseDown={() => {
                    urlParams.get("copy")
                      ? (async function () {
                          const res = await fetch(
                            "http://localhost:4000/api/semester/copy",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                              body: JSON.stringify({
                                currentSemesterId:
                                  urlParams.get("currentSemester"),
                                targetSemesterId: sem._id,
                              }),
                            }
                          );
                          navigate(
                            `/semester/${urlParams.get(
                              "currentSemester"
                            )}/summary`
                          );
                        })()
                      : navigate(`/semester/${sem._id}/summary`);
                  }}
                >
                  <td className="flex text-xl font-semibold flex-row items-center text-black p-2">
                    <FaRegFileAlt />
                    {sem.semesterType} Semester {sem.AY}
                  </td>
                  <td className="text-black text-xl font-semibold p-2">
                    {sem.modifiedBy}
                  </td>
                  <td className="text-black text-xl font-semibold p-2">
                    {sem.dateModified}
                  </td>
                  {editing && (
                    <td onMouseDown={(e) => e.stopPropagation()}>
                      <button onClick={() => handleDeleteClick(sem._id)}>
                        <IoTrashOutline />
                      </button>
                    </td>
                  )}
                  {urlParams.get("copy") && (
                    <td className="flex items-center text-black font-bold text-xl p-2">
                      <FaRegCopy />
                      COPY
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-enamelled-jewel text-2xl text-center font-bold p-2"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          style={{ border: "2px solid #035C65", borderColor: "#035C65" }}
        >
          <h1 className="text-5xl text-enamelled-jewel font-bold bg-placebo-turquoise border-b-4 mb-4 border-enamelled-jewel rounded-tl-md rounded-tr-md pl-5 py-2">
            New File
          </h1>
          <ModalCloseButton
            size="sm"
            style={{ ...commonModalButtonStyle, color: "white" }}
          />
          <ModalBody>
            <div className="flex flex-row items-center mb-10">
              <div className="pr-3">
                <h1 className="text-3xl font-semibold mr-10">
                  Academic Year:{" "}
                </h1>
              </div>
              <div>
                <input
                  className="w-20 h-10 text-2xl border border-black rounded-md p-1 text-center"
                  onChange={(e) => setFirstYear(e.target.value)}
                  type="text"
                  placeholder="Year"
                />
              </div>
              <div className="mx-5 text-enamelled-jewel font-semibold border w-2 border-black"></div>
              <div>
                <input
                  className="w-20 h-10 text-2xl border border-black rounded-md p-1 text-center"
                  onChange={(e) => setSecondYear(e.target.value)}
                  type="text"
                  placeholder="Year"
                />
              </div>
            </div>
            <div className="flex flex-row items-center">
              <h1 className="text-3xl font-semibold mr-16">Semester: </h1>
              <button
                onClick={() => setSemester("1st")}
                className={`mr-6 ${
                  semester === "1st" ? "bg-placebo-turquoise shadow-custom" : ""
                } border w-16 h-10 text-2xl border-black rounded-md`}
              >
                1st
              </button>
              <button
                onClick={() => setSemester("2nd")}
                className={`mr-6 ${
                  semester === "2nd" ? "bg-placebo-turquoise shadow-custom" : ""
                } border w-16 h-10 text-2xl border-black rounded-md`}
              >
                2nd
              </button>
              <button
                onClick={() => setSemester("Mid Year")}
                className={`mr-6 ${
                  semester === "Mid Year"
                    ? "bg-placebo-turquoise shadow-custom"
                    : ""
                } border w-32 h-10 text-2xl border-black rounded-md`}
              >
                Mid Year
              </button>
            </div>
          </ModalBody>
          <ModalFooter justifyContent={"center"} alignItems={"center"}>
            <div className="flex flex-row space-x-4 mt-6">
              <button
                onClick={() => handleSubmit(firstYear, secondYear, semester)}
                className="w-20 h-10 text-enamelled-jewel font-semibold border border-enamelled-jewel transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
              >
                Add
              </button>
              <button
                onClick={onClose}
                className="w-20 h-10 text-enamelled-jewel font-semibold border border-enamelled-jewel transition ease-in duration-200 hover:shadow-custom hover:bg-placebo-turquoise"
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Home;
