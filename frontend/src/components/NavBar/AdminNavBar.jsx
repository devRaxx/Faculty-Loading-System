import { useNavigate, useLocation } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";

const AdminNavBar = () => {
  return (
    <nav className="bg-placebo-turquoise p-8 border-b-2 border-enamelled-jewel">
      <div className="flex items-center space-x-24 justify-center gap-x-18 gap-2 px-2">
        <LinkButton to="/admin">
          <IoMdHome /> Home
        </LinkButton>
        <LinkButton to="/">
          <IoIosLogOut /> Sign Out
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
    navigate(to);
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
      className={`flex items-center cursor-pointer text-3xl bg-transparent text-enamelled-jewel font-bold hover:text-enamelled-jewel ${
        isActive ? "border-b-2 border-enamelled-jewel rounded-sm" : ""
      }`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default AdminNavBar;
