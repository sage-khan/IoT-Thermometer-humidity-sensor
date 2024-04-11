import React, { useContext } from "react";
import { View, StyleSheet, Text, StatusBar, Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";

import EachRoomLights from "./EachRoomLights";
import EachRoomTemperature from "./EachRoomTemperature";
import { GlobalContext } from '../context/Context';
import HeaderComponent from "./Header";

const Tab = createMaterialTopTabNavigator();

const EachRoom = ({ navigation }) => {
  // const { roomId } = route.params;
  let { state } = useContext(GlobalContext);

  // console.log('hello from each room ==========>')
  return (
    <View style={{
      flex: 1,
    }}>
      <HeaderComponent title="Room Features" backIcon="arrow-back" backAction={() => navigation.goBack()} />
      <Tab.Navigator
        initialRouteName="Temperature"
        tabBarOptions={{
          activeTintColor: state.blueLightTheme.primary,
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Temperature" component={EachRoomTemperature}/>
        <Tab.Screen name="Lights">{() => <EachRoomLights/>}</Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({});

export default EachRoom;
