import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import AppLoading from "expo-app-loading";
import axios from "axios";
import { useFonts } from "expo-font";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
export default function Temperature({API_URL}) {
  const [reading, setReading] = useState([]);
  const [date, setDate] = useState(new Date());
  const [navigation, setNavigation] = useState(0);
  let [fontsLoadded] = useFonts({
    "Montserrat-SemiBold": require("../assets/Montserrat-SemiBold.otf"),
  });
  useEffect(() => {
    getTemperatures();
  }, []);

  const getTemperatures = async () => {
    try {
      const { data, status } = await axios.get(
        `http://${API_URL}:5000/roomtemperature`
      );
      console.log("Data", data[1]);
      setReading(data);
      setDate(new Date());
    } catch (error) {
      console.log(error);
    }
  };

  setInterval(getTemperatures, 10000);
  if (!fontsLoadded) {
    return <AppLoading error={(error) => console.log("Error: ", error)} />;
  }

  const stepForm = () => {
    switch (navigation) {
      case 0:
        return (
          <>
            <View style={styles.mainContainer}>
              <View style={styles.firstContainer}>
                <Text style={{ ...styles.textStyle }}>
                  {reading[1]?.temperature}
                  <Text style={{ color: "#000" }}>°F</Text>
                </Text>
                <FontAwesome name="thermometer-4" size={180} color="#4c7EA8" />
              </View>
              <View style={styles.secondContainer}>
                <Text
                  style={{
                    ...styles.textStyle,
                    ...styles.timeStyle,
                  }}
                >
                  Last Updated:{" "}
                  <Text
                    style={{ color: "#000" }}
                  >{`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</Text>
                </Text>
              </View>
            </View>
          </>
        );
      case 1:
        return (
          <>
            <View style={styles.mainContainer}>
              <View style={styles.firstContainer}>
                <Text style={{ ...styles.textStyle }}>
                  {reading[0]?.humidity}
                  <Text style={{ color: "#000" }}>%</Text>
                </Text>
                <Ionicons name="water" size={200} color="#4c7EA8" />
              </View>
              <View style={styles.secondContainer}>
                <Text
                  style={{
                    ...styles.textStyle,
                    ...styles.timeStyle,
                  }}
                >
                  Last Updated:{" "}
                  <Text
                    style={{ color: "#000" }}
                  >{`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</Text>
                </Text>
              </View>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <View style={styles.mainContainer}>
              <View style={styles.firstContainer}>
                <Text style={{ ...styles.textStyle }}>Active</Text>
                <MaterialCommunityIcons
                  name="door"
                  size={150}
                  color="#4c7EA8"
                />
              </View>
              <View style={styles.secondContainer}>
                <Text
                  style={{
                    ...styles.textStyle,
                    ...styles.timeStyle,
                  }}
                >
                  Last Updated:{" "}
                  <Text
                    style={{ color: "#000" }}
                  >{`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</Text>
                </Text>
              </View>
            </View>
          </>
        );
    }
  };
  return (
    <>
      <View style={styles.screen}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setNavigation(0)}>
            <Text
              style={
                navigation == 0
                  ? {
                      ...styles.buttonStyle,
                      ...styles.isActive,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }
                  : {
                      ...styles.buttonStyle,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }
              }
            >
              Temprature
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNavigation(1)}>
            <Text
              style={
                navigation == 1
                  ? {
                      ...styles.buttonStyle,
                      ...styles.isActive,
                      borderRadius: 0,
                    }
                  : {
                      ...styles.buttonStyle,
                      borderRadius: 0,
                    }
              }
            >
              Humidity
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNavigation(2)}>
            <Text
              style={
                navigation == 2
                  ? {
                      ...styles.buttonStyle,
                      ...styles.isActive,
                      borderBottomLeftRadius: 0,
                      borderTopLeftRadius: 0,
                    }
                  : {
                      ...styles.buttonStyle,
                      borderBottomLeftRadius: 0,
                      borderTopLeftRadius: 0,
                    }
              }
            >
              Door
            </Text>
          </TouchableOpacity>
        </View>

        {stepForm()}
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
