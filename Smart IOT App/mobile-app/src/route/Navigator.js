import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import ScratchScreen from "../screens/Scratch";
import RoomScreen from "../screens/room";
import CoffeeScreen from "../screens/Coffee";
import WaterPumpScreen from "../screens/WaterPump";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import ForgotPassword from "../screens/ForgotPassword";
import CreateHome from "../screens/CreateHome";
import CreateFloor from "../screens/CreateFloor";
import NewPassword from "../screens/NewPassword";
import HomeList from "../screens/HomeList";
import HomeContent from "../screens/HomeContent";
import CreateTank from "../screens/CreateTank";
import TankScreen from "../screens/TankList";
import FloorScreen from "../screens/FloorList";
import RoomContent from "../screens/RoomContent";
import CreateRoom from "../screens/CreateRoom";
import CreatePipeline from "../screens/CreatePipeline";
import LightScreen from "../screens/LightScreen";
import WaterReading from "../screens/WaterReading";
import Splash from "../screens/SplashScreen";
// import Hello from "../src/screens/Hello";
import { GlobalContext } from "../context/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
      <Stack.Screen name="HomeContent" component={HomeContent} />
      <Stack.Screen name="CreateTank" component={CreateTank} />
      <Stack.Screen name="CreateHome" component={CreateHome} />
      <Stack.Screen name="CreateFloor" component={CreateFloor} />
      <Stack.Screen name="TankScreen" component={TankScreen} />
      <Stack.Screen name="Floorscreen" component={FloorScreen} />
      <Stack.Screen name="WaterPumpScreen" component={WaterPumpScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Room" component={RoomScreen} />
      <Stack.Screen name="Coffee" component={CoffeeScreen} />
      <Stack.Screen name="WaterPump" component={WaterPumpScreen} />
      <Stack.Screen name="RoomContent" component={RoomContent} />
      <Stack.Screen name="CreateRoom" component={CreateRoom} />
      <Stack.Screen name="CreatePipeline" component={CreatePipeline} />
      <Stack.Screen name="LightScreen" component={LightScreen} />
      <Stack.Screen name="WaterReading" component={WaterReading} />
    </Stack.Navigator>
  );
}

function TabStack() {
  return (
    <Tab.Navigator initialRouteName="List">
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="List" component={ListStack} />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  const [token, setToken] = useState();

  async function getData() {
    try {
      const value = await AsyncStorage.getItem("token");
      // console.log("id: ", value);
      setToken(value);
    } catch (error) {
      // console.log(error);
    }
  }

  // if(token != null){
  //     console.log('tabStack')
  //     return TabStack();
  // }

  // if(token == null){
  //     console.log('authStack')
  //     return AuthStack();
  // }

  useEffect(() => {
    // getData();
  }, []);

  return AuthStack();
};

export default StackNavigator;
