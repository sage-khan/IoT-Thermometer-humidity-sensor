import React, { createContext, useReducer } from "react";
import { reducer } from "../reducer/Reducer";

export const GlobalContext = createContext("Initial Value");
let data = {
  //Do not add / at the end of baseUrl
  baseUrl: "http://192.168.0.111:5000",
  // baseUrl: "https://ai-home-automation.herokuapp.com",
  darkTheme: { backgroundColor: "brown" },
  blueLightTheme: { primary: "#043A75", secondary: "#00A5E1", gray: "#E3E3E3" },
  purpleLightTheme: { primary: "#716BF6", secondary: "#8A8FFE" },
  // theme: { fontFamily: "Playfair" },
  backgroundColor: "#A78C43",
  bool: true,
  refreshHomes: true,
  refreshFloors: true,
  refreshTanks: true,
  refreshRooms: true,
  refreshPipelines: true,
};

export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}
