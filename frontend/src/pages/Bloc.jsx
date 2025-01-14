import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlocFilterBar from "../components/Filters/BlocFilterBar";
import TimeTable from "../components/Tables/TimeTable";
import BlocSchedList from "../components/Tables/BlocSchedList";
import BlocDetails from "../components/Tables/BlocDetails";
import BlocSearch from "../components/Filters/BlocSearch";

const Bloc = () => {
  const [semScheds, setSemScheds] = useState([]);
  const params = useParams();
  useEffect(() => {
    (async function () {
      const res = await fetch(
        `http://localhost:4000/api/semester/${params.id}`,
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
      {/* {
                semScheds.length > 0 ? (
                    semScheds.map((sched)=>{
                        <div>
                            {sched}
                        </div>
                    })
                ):(
                    <div>
                        THIS IS EMPTY
                    </div>
                )
            } */}
      <div className="flex flex-row w-full justify-evenly">
        <TimeTable />
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
