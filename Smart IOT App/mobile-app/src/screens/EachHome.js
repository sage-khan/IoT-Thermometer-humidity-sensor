import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Floors from "./FloorList";
import Tanks from "./TankList";
import HeaderComponent from './Header';

import { GlobalContext } from "../context/Context";

const Tab = createMaterialTopTabNavigator();

const EachHome = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  // const [name, setName] = useState("Create Floor");

  return (
    <View style={{
      flex: 1,
    }}>
      <HeaderComponent
        title="Home Features"
        backIcon="arrow-back"
        backAction={() => navigation.navigate('HomeList')}
      />

      <Tab.Navigator
        initialRouteName="Floors"
        tabBarOptions={{
          activeTintColor: state.blueLightTheme.primary,
          inactiveTintColor: "gray",
        }}>
        <Tab.Screen name="Floors" >
          {(props) => (
            <Floors
              prop={props}

            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Tanks">
          {(props) => (
            <Tanks
              prop={props}

            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default EachHome;
