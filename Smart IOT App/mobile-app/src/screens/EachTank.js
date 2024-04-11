import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { io } from "socket.io-client";
import socketIOClient from "socket.io-client";
import { GlobalContext } from "../context/Context";
// import ProgressCircle from "react-native-progress-circle";
import HeaderComponent from "./Header";
import LiquidAnimation from "../components/LiquidAnimation";
import { Container } from "native-base";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import axios from "axios";
import Loader from "../components/loader";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
// deployed server url
const socket = io(`https://ai-home-automation.herokuapp.com`);

// on connect
socket.on("connect", (socket) => {
  console.log("Socket Connected..");
});

// on disconnect
socket.on("disconnect", () => {
  console.log("Socket Disconnected!");
});

const EachTank = ({ route, navigation }) => {
  let tankId = "611e3ea04209765530fae5c4";
  // 61178f9c7b067532844e4d80
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  // const { id } = route.params;
  let { state } = useContext(GlobalContext);
  const [reading, setReading] = useState(0);
  //Keep inside component
  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: true,
  //     shouldSetBadge: true,
  //   }),
  // });
  async function schedulePushNotification(message) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Smart Home!",
        body: message,
        data: { data: "goes here" },
      },
      trigger: { seconds: 1 },
    });
  }

  function readingParser(actualReading) {
    let parsedReading = 210 - actualReading;
    return parsedReading;
  }

  // whenever new reading comes
  socket.on("611e3ea04209765530fae5c4", (data) => {
    // console.log("Socket --->", data.data.waterLevel);
    setReading(data.data.waterLevel);
  });

  // : Generate Notification when tank is full
  socket.on("tankfull", (data) => {
    console.log("Tank Full", data);
    schedulePushNotification(data.event);
  });

  // : Generate Notification when tank is empty
  socket.on("tankempty", (data) => {
    console.log("Tank Empty", data);
    schedulePushNotification(data.event);
  });

  useEffect(() => {
    axios
      .get(`${state.baseUrl}/waterlevel?tankId=${tankId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("REsponse", res.data[0]);
        setReading(res.data[0]?.waterLevel);
      })
      .catch((error) => {
        console.log("Error in eachTank.js", error);
      });

    // Hello World || Testing.
    // schedulePushNotification("my notification");

    // register push notification
    (async function registerForPushNotificationsAsync() {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("token for notification: ", token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      return token;
    })();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("notification: ", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);

      socket.disconnect();
    };
  }, []);

  return (
    <Container>
      <HeaderComponent
        title="Water Tank"
        backIcon="arrow-back"
        backAction={() => navigation.goBack()}
      />
      {reading ? (
        <LiquidAnimation
          isCritical={reading > 210 || reading < 10 ? true : false}
          reading={reading < 10 ? 9 : readingParser(reading)}
        />
      ) : (
        <Loader loading={true} />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  levelViewStyle: {
    backgroundColor: "#d4f1f9",
    height: 100,
    alignSelf: "stretch",
  },
});

export default EachTank;
