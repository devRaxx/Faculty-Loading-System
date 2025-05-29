import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const BlocFilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queries, setQueries] = useState([]);
  useEffect(() => {
    setSearchParams({ filter: queries });
  }, [queries]);

  function handleCheck(event) {
    if (event.target.checked) {
      setQueries([event.target.value, ...queries]);
    } else if (!event.target.checked) {
      const temp = queries;
      const index = temp.indexOf(event.target.value);
      temp.splice(index, 1);
      setQueries([...temp]);
    }
  }

  return (
    <div className="flex flex-col justify-between space-y-5">
      <div className="flex flex-row justify-between items-center space-x-3 bg-placebo-turquoise border border-enamelled-jewel p-2">
        <p className="text-2xl text-enamelled-jewel-text font-bold">Program:</p>
        <div className="text-enamelled-jewel-text font-medium">
          <input
            type="checkbox"
            onChange={(e) => {
              handleCheck(e);
            }}
            value="CSM"
          />{" "}
          CSM{" "}
        </div>
        <div className="text-enamelled-jewel-text font-medium">
          <input
            type="checkbox"
            onChange={(e) => {
              handleCheck(e);
            }}
            value="CHSS"
          />{" "}
          CHSS{" "}
        </div>
        <div className="text-enamelled-jewel-text font-medium">
          <input
            type="checkbox"
            onChange={(e) => {
              handleCheck(e);
            }}
            value="SOM"
          />{" "}
          SOM{" "}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center space-x-3 bg-placebo-turquoise border border-enamelled-jewel p-2">
        <p className="text-2xl text-enamelled-jewel-text font-bold">
          Year Level:
        </p>
        <div className="text-enamelled-jewel-text font-medium">
          <input
            type="checkbox"
            onChange={(e) => {
              handleCheck(e);
            }}
            value="1st"
          />{" "}
          1st{" "}
        </div>
        <div className="text-enamelled-jewel-text font-medium">
          <input
            type="checkbox"
            onChange={(e) => {
              handleCheck(e);
            }}
            value="2nd"
          />{" "}
          2nd{" "}
        </div>
        <div className="text-enamelled-jewel-text font-medium">
          <input
            type="checkbox"
            onChange={(e) => {
              handleCheck(e);
            }}
            value="3rd"
          />{" "}
          3rd{" "}
        </div>
        <div className="text-enamelled-jewel-text font-medium">
          <input
            type="checkbox"
            onChange={(e) => {
              handleCheck(e);
            }}
            value="4th"
          />{" "}
          4th{" "}
        </div>
      </div>
    </div>
  );
};

export default BlocFilterBar;
