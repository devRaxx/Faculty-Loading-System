import { createContext, useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";

export const AdminContext = createContext();

export const adminReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "CREATE_USER":
      return {
        ...state,
        users: [action.payload, ...state.users],
      };
    case "UPDATE_USER":
      return {
        ...state,
        selectedUser: {},
        users: [...state.users].map((obj) => {
          if (obj._id == action.payload._id) {
            return action.payload;
          }
          return obj;
        }),
      };
    case "SELECT_USER":
      return {
        ...state,
        selectedUser: action.payload,
      };
  }
};

export const AdminContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, {
    users: [],
    selectedUser: {},
  });
  const params = useParams();
  useEffect(() => {
    (async function () {
      const res = await fetch(
        "https://faculty-loading-system.vercel.app/api/admin",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      dispatch({ type: "SET_USERS", payload: data });
    })();
  }, [params.id]);
  return (
    <AdminContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
};
