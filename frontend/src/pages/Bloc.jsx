import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlocFilterBar from "../components/Filters/BlocFilterBar";
import BlocTable from "../components/Tables/BlocTable";
import BlocSchedList from "../components/Tables/BlocSchedList";
import BlocSearch from "../components/Filters/BlocSearch";

const Bloc = () => {
  const [semScheds, setSemScheds] = useState([]);
  const params = useParams();
  useEffect(() => {
    (async function () {
      const res = await fetch(
        `https://faculty-loading-system.vercel.app/api/semester/${params.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      setSemScheds(data);
    })();
  }, [params.id]);

  return (
    <div className="flex flex-col w-full px-48 space-y-5 justify-center items-center mt-10">
      <div className="flex flex-row w-full justify-evenly">
        <BlocTable />
        <div className="flex flex-col space-y-5">
          <BlocFilterBar />
          <BlocSearch />
        </div>
      </div>
      <div className="border border-enamelled-jewel w-5/6"></div>
      <BlocSchedList />
    </div>
  );
};

export default Bloc;
