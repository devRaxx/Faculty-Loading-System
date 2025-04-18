import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { AiFillHome } from "react-icons/ai";
import { TiExport } from "react-icons/ti";
import { LuClipboardList } from "react-icons/lu";
import { MdPerson2 } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaListUl } from "react-icons/fa";
import { useDisclosure } from "@chakra-ui/react";
import HomeModal from "../modals/HomeModal.jsx";
import ExportModal from "../modals/ExportModal.jsx";
import SummaryModal from "../modals/SummaryModal.jsx";
import FacultyModal from "../modals/FacultyModal.jsx";
import BlocModal from "../modals/BlocModal.jsx";
import AlphaListModal from "../modals/AlphaListModal.jsx";

const Help = () => {
  const {
    isOpen: isHomeModalOpen,
    onOpen: OnOpenHomeModal,
    onClose: OnCloseHomeModal,
  } = useDisclosure();
  const {
    isOpen: isExportModalOpen,
    onOpen: OnOpenExportModal,
    onClose: OnCloseExportModal,
  } = useDisclosure();
  const {
    isOpen: isSummaryModalOpen,
    onOpen: OnOpenSummaryModal,
    onClose: OnCloseSummaryModal,
  } = useDisclosure();
  const {
    isOpen: isFacultyModalOpen,
    onOpen: OnOpenFacultyModal,
    onClose: OnCloseFacultyModal,
  } = useDisclosure();
  const {
    isOpen: isBlocModalOpen,
    onOpen: OnOpenBlocModal,
    onClose: OnCloseBlocModal,
  } = useDisclosure();
  const {
    isOpen: isAlphaListModalOpen,
    onOpen: OnOpenAlphaListModal,
    onClose: OnCloseAlphaListModal,
  } = useDisclosure();

  return (
    <div className="flex flex-col h-screen w-screen">
      <NavBar />
      <div className="p-5">
        <div className="border-b-4 border-enamelled-jewel">
          <h1 className="!font-family:Sora font-extrabold text-enamelled-jewel">
            Faculty Loading System
          </h1>
          <p className="py-3 font-regular text-justify text-xl text-black">
            Welcome to the Faculty Loading System, your efficient solution for
            seamlessly managing subject schedules and teacher workloads. This
            guide is your key to comprehending and optimizing the
            functionalities offered by this application. The Faculty Loading
            System is designed with the tools needed to efficiently create,
            modify, and organize subject schedules. With an intuitive interface
            and powerful features, this app simplifies the process of handling
            faculty loads, schedules, and exportation of data.
          </p>
          <p className="font-bold text-justify text-2xl underline text-black">
            Key Features Overview:
          </p>
          <p className="py-3 font-regular text-justify text-xl text-black">
            Subject Scheduling: The app allows users to create comprehensive
            schedules for their subjects. Easily input class timings, lecture
            slots, and seminar periods with a user-friendly interface. <br />
            Load Management: Department heads can easily modify the workload
            assigned to faculty members, facilitating simple adjustments to
            different loads within their responsibilities.
            <br />
            Export to Excel: Seamlessly export schedules and unit details to an
            Excel spreadsheet for further analysis, sharing, or printing. This
            export function ensures easy integration with other tools and
            provides a convenient way to work with the data. <br />
          </p>
        </div>
        <div className="flex flex-col pt-12 gap-y-10">
          <div className="flex flex-row justify-center gap-x-40">
            <button
              className="flex flex-col items-center justify-center py-5 font-family:Sora font-extrabold text-3xl border-enamelled-jewel rounded-lg bg-placebo-turquoise text-enamelled-jewel w-48 transition ease-in duration-200 hover:shadow-custom focus:shadow-custom"
              onClick={OnOpenHomeModal}
            >
              <AiFillHome size={80} />
              Home
            </button>
            <HomeModal isOpen={isHomeModalOpen} onClose={OnCloseHomeModal} />
            <button
              className="flex flex-col items-center justify-center py-5 font-family:Sora font-extrabold text-3xl border-enamelled-jewel rounded-lg bg-placebo-turquoise text-enamelled-jewel w-48 transition ease-in duration-200 hover:shadow-custom focus:shadow-custom"
              onClick={OnOpenExportModal}
            >
              <TiExport size={80} />
              Export
            </button>
            <ExportModal
              isOpen={isExportModalOpen}
              onClose={OnCloseExportModal}
            />
            <button
              className="flex flex-col items-center justify-center py-5 font-family:Sora font-extrabold text-3xl border-enamelled-jewel rounded-lg bg-placebo-turquoise text-enamelled-jewel w-48 transition ease-in duration-200 hover:shadow-custom focus:shadow-custom"
              onClick={OnOpenSummaryModal}
            >
              <LuClipboardList size={80} />
              Summary
            </button>
            <SummaryModal
              isOpen={isSummaryModalOpen}
              onClose={OnCloseSummaryModal}
            />
          </div>
          <div className="flex flex-row justify-center gap-x-40">
            <button
              className="flex flex-col items-center justify-center py-5 font-family:Sora font-extrabold text-3xl border-enamelled-jewel rounded-lg bg-placebo-turquoise text-enamelled-jewel w-48 transition ease-in duration-200 hover:shadow-custom focus:shadow-custom"
              onClick={OnOpenFacultyModal}
            >
              <MdPerson2 size={80} />
              Faculty
            </button>
            <FacultyModal
              isOpen={isFacultyModalOpen}
              onClose={OnCloseFacultyModal}
            />
            <button
              className="flex flex-col items-center justify-center py-5 font-family:Sora font-extrabold text-3xl border-enamelled-jewel rounded-lg bg-placebo-turquoise text-enamelled-jewel w-48 transition ease-in duration-200 hover:shadow-custom focus:shadow-custom"
              onClick={OnOpenBlocModal}
            >
              <FaPeopleGroup size={80} />
              Bloc
            </button>
            <BlocModal isOpen={isBlocModalOpen} onClose={OnCloseBlocModal} />
            <button
              className="flex flex-col items-center justify-center py-5 font-family:Sora font-extrabold text-3xl border-enamelled-jewel rounded-lg bg-placebo-turquoise text-enamelled-jewel w-48 transition ease-in duration-200 hover:shadow-custom focus:shadow-custom"
              onClick={OnOpenAlphaListModal}
            >
              <FaListUl size={80} />
              Alpha List
            </button>
            <AlphaListModal
              isOpen={isAlphaListModalOpen}
              onClose={OnCloseAlphaListModal}
            />
          </div>
        </div>
        <button
          className="bg-red-900"
          onClick={async () => {
            const res = await fetch(
              "http://localhost:4000/api/bloc/6785bacb9b3059c206f7f71c",
              {
                method: "GET",
                credentials: "include",
              }
            );
            const data = await res.json();
            const groupedSchedules = {};

            data.flat().forEach((entry) => {
              const bloc = entry.bloc;
              const blocKey = `${bloc.name}_Y${bloc.yearLevel}_B${bloc.bloc}`;

              if (!groupedSchedules[blocKey]) {
                groupedSchedules[blocKey] = {
                  blocInfo: bloc,
                  schedules: [],
                };
              }

              groupedSchedules[blocKey].schedules.push(entry.sched);
            });

            const result = Object.values(groupedSchedules);

            console.log(result);
          }}
        >
          hello
        </button>
      </div>
    </div>
  );
};

export default Help;
