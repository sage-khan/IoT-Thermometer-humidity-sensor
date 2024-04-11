import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import AppLoading from "expo-app-loading";
import axios from "axios";
import { useFonts } from "expo-font";
import Login from './components/Login'
import Temperature from './components/Temperature'

import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
export default function App() {
  const API_URL = "192.168.43.69";
  const [isLoggedIn, setIsLoggedIn] = useState(false) 


  return (
    <>
      <View style={styles.screen}>
        {isLoggedIn ? <Temperature API_URL={API_URL}/> : <Login API_URL={API_URL} setLogin={setIsLoggedIn}/>  }        
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    marginTop: 80,
  },
  buttonStyle: {
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
    paddingVertical: 8,
    minWidth: 110,
    textAlign: "center",
    borderColor: "#ff0000",
    color: "#ff0000",
  },
  isActive: {
    color: "#fff",
    backgroundColor: "#ff0000",
  },
  textStyle: {
    fontSize: 40,
    color: "#ff0000",
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 20,
  },
  textBorderStyle: {
    borderWidth: 1,
    minHeight: 1,
    minWidth: 90,
    borderColor: "#ff0000",
    marginTop: 5,
  },
  textBorderHumidityStyle: {
    borderWidth: 1,
    minHeight: 1,
    minWidth: 60,
    borderColor: "#ff0000",
    marginTop: 5,
  },
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
    width: "100%",
  },
  firstContainer: {
    height: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  secondContainer: { justifyContent: "flex-end", height: "30%" },
  timeStyle: {
    fontSize: 25,
    borderTopWidth: 2,
    paddingTop: 20,
    borderColor: "#ff0000",
  },
});
