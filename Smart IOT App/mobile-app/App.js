// import "react-native-gesture-handler";

import { LogBox } from "react-native";
import { Root, Icon } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import EachFloor from "./src/screens/EachFloor";
import ScratchScreen from "./src/screens/Scratch";
// import RoomTemperature from "./src/screens/RoomTemperature";
import CoffeeScreen from "./src/screens/Coffee";
import EachTank from "./src/screens/EachTank";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import ForgotPassword from "./src/screens/ForgotPassword";
import CreateHome from "./src/screens/CreateHome";
import CreateFloor from "./src/screens/CreateFloor";
import NewPassword from "./src/screens/NewPassword";
import HomeList from "./src/screens/HomeList";
import EachHome from "./src/screens/EachHome";
import CreateTank from "./src/screens/CreateTank";
import EachRoom from "./src/screens/EachRoom";
import CreateRoom from "./src/screens/CreateRoom";
import CreatePipeline from "./src/screens/CreatePipeline";
import LightScreen from "./src/screens/EachRoomLights";
import WaterReading from "./src/screens/WaterReading";
import Splash from "./src/screens/SplashScreen";
// import Hello from "./src/screens/Hello";
import ContextProvider from "./src/context/Context";
import EachPipeline from "./src/screens/EachPipeline";
import PipelineList from "./src/screens/PipeLinesList";
const Stack = createStackNavigator();
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      {/* <Stack.Screen name="Scratch" component={ScratchScreen} /> */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPwd" component={ForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  );
}

function SplashStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
}

function ListStack() {
  return (
    <Stack.Navigator initialRouteName="HomeList" headerMode="none">
      <Stack.Screen name="HomeList" component={HomeList} />
      <Stack.Screen name="EachHome" component={EachHome} />
      <Stack.Screen name="CreateTank" component={CreateTank} />
      <Stack.Screen name="CreateHome" component={CreateHome} />
      <Stack.Screen name="CreateFloor" component={CreateFloor} />
      <Stack.Screen name="EachTank" component={EachTank} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="EachFloor" component={EachFloor} />
      {/* <Stack.Screen name="Room" component={RoomScreen} /> */}
      {/* <Stack.Screen name="Coffee" component={CoffeeScreen} /> */}
      <Stack.Screen name="EachRoom" component={EachRoom} />
      <Stack.Screen name="CreateRoom" component={CreateRoom} />
      <Stack.Screen name="CreatePipeline" component={CreatePipeline} />
      <Stack.Screen name="LightScreen" component={LightScreen} />
      <Stack.Screen name="WaterReading" component={WaterReading} />
      <Stack.Screen name="EachPipeline" component={EachPipeline} />
      <Stack.Screen name="PipelineList" component={PipelineList} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator
      initialRouteName="List"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "List") {
            iconName = focused ? "view-list" : "format-list-bulleted";
          }

          // You can return any component that you like here!
          return <Icon type="MaterialCommunityIcons" name={iconName} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#043A75",
        inactiveTintColor: "black",
      }}
    >
      <Tab.Screen name="List" component={ListStack} />
      <Tab.Screen name="Home" component={HomeStack} />
    </Tab.Navigator>
  );
}

const App = () => {
  LogBox.ignoreAllLogs();

  let [fontsLoaded] = useFonts({
    "montserrat-light": require("./assets/fonts/Montserrat-Light.ttf"),
    "montserrat-regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "montserrat-semiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    (async () =>
      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      }))();
  }, []);

  if (fontsLoaded) {
    return (
      <Root>
        <ContextProvider>
          <NavigationContainer>
            <Stack.Navigator headerMode="none">
              <Stack.Screen name="Splash" component={SplashStack} />
              <Stack.Screen name="TabStack" component={TabStack} />
              <Stack.Screen name="AuthStack" component={AuthStack} />
            </Stack.Navigator>
          </NavigationContainer>
        </ContextProvider>
      </Root>
    );
  } else {
    return <AppLoading error={(error) => console.log("Error: ", error)} />;
  }
};

export default App;
