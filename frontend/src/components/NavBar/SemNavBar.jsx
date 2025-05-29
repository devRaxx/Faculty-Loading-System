import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { LuClipboardList } from "react-icons/lu";
import { MdPerson2 } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaListUl } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";

const SemNavbar = ({ semId }) => {
  return (
    <nav className="bg-placebo-turquoise p-8 border-b-2 border-enamelled-jewel">
      <div className="flex items-center space-x-24 justify-center gap-x-18 gap-2 px-2">
        <LinkButton to={`/home`}>
          <TiArrowBack /> Back
        </LinkButton>
        <LinkButton to={`/semester/${semId}/summary`}>
          <LuClipboardList /> <p className="px-1">Summary</p>
        </LinkButton>
        <LinkButton to={`/semester/${semId}/faculty`}>
          <MdPerson2 /> <p className="px-1">Faculty</p>
        </LinkButton>
        <LinkButton to={`/semester/${semId}/bloc`}>
          <FaPeopleGroup /> <p className="px-1">Bloc</p>
        </LinkButton>
        <LinkButton to={`/semester/${semId}/alphalist`}>
          <FaListUl /> <p className="px-1">Alpha List</p>
        </LinkButton>
        <LinkButton to="/">
          <IoIosLogOut /> <p className="px-1">Sign Out</p>
        </LinkButton>
      </div>
    </nav>
  );
};

const LinkButton = ({ to, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = to === location.pathname;

  const handleSignOut = () => {
    (async function () {
      await fetch("http://localhost:4000/api/auth/signout", {
        method: "GET",
        credentials: "include",
      });
    })();
  };
  const handleClick = () => {
    if (!isActive) {
      if (to == "/") {
        handleSignOut();
      }
      navigate(to);
    }
  };

  return (
    <a
      className={`flex items-center cursor-pointer text-3xl bg-transparent text-enamelled-jewel font-bold ${
        isActive ? "border-b-2 border-enamelled-jewel rounded-sm" : ""
      }`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default SemNavbar;
