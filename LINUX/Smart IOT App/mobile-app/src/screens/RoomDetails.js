import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Platform,
  ImageBackground,
  Dimensions,
} from "react-native";
import { FAB, Menu, Provider } from "react-native-paper";
import {
  Drawer,
  Container,
  Footer,
  FooterTab,
  Icon,
  Button,
  Spinner,
} from "native-base";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { GlobalContext } from "../context/Context";
const screenWidth = Dimensions.get("window").width - 10;

const RoomDetails = ({ item, navigation, deleteRoom, isRooms }) => {
  let { state } = useContext(GlobalContext);
  const [currentTemp, setCurrentTemp] = useState();
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const handleDelete = async (roomData) => {
    // console.log("Delete", roomData);
    const response = await deleteRoom(roomData);
    setVisible(false);
  };
  // 610e6abc662cec3b607c4096
  function getTemperature() {
    setSpinner(true);
    console.log("item in Room details", item._id);
    axios
      .get(`${state.baseUrl}/roomtemperature/?roomId=${item._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("Server resposne in room details===>", res.data);
        setCurrentTemp(res.data[res.data.length - 1].temperature);
        // console.log("temp", res.data[res.data.length - 1].temperature);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);
        console.log("Error in RoomDetails.js", err);
      });
  }

  useEffect(() => {
    getTemperature();
  }, [state.refreshRooms, isRooms]);

  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.setItem("roomId", item._id);
          navigation.navigate("EachRoom");
        }}
      >
        <ImageBackground
          style={styles.imageStyle}
          borderRadius={10}
          source={require("../../assets/room.jpg")}
        >
          <View
            style={{
              alignItems: "flex-end",
              marginTop: 10,
              marginHorizontal: 5,
            }}
          >
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              overlayAccessibilityLabel="Close menu"
              anchor={
                <Icon
                  name="dots-three-vertical"
                  type="Entypo"
                  style={{ color: "white" }}
                  onPress={() => {
                    openMenu();
                  }}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                }}
                title="Edit"
              />
              <Menu.Item
                onPress={() => {
                  handleDelete(item);
                }}
                title="Delete"
              />
            </Menu>
          </View>
        </ImageBackground>

        <Text
          style={{
            position: "absolute",
            left: 20,
            top: 50,
            fontWeight: "200",
            fontSize: 30,
            color: "white",
            // color: state.blueLightTheme.primary,
            // fontFamily:""
          }}
        >
          Temperature
        </Text>

        {spinner ? (
          <Spinner
            color="white"
            style={{ position: "absolute", left: 85, top: 75 }}
          />
        ) : currentTemp ? (
          <Text
            style={{
              position: "absolute",
              left: 55,
              top: 85,
              fontWeight: "bold",
              fontSize: 35,
              color: "white",
            }}
          >
            {`${Math.round(currentTemp)} °C`}
          </Text>
        ) : (
          <>
            <View
              style={{
                width: 45,
                height: 3,
                borderColor: "white",
                borderWidth: 2,
                position: "absolute",
                left: 50,
                top: 120,
              }}
            ></View>
            <View
              style={{
                width: 45,
                height: 3,
                borderColor: "white",
                borderWidth: 2,
                position: "absolute",
                left: 110,
                top: 120,
              }}
            ></View>
          </>
        )}

        <Text
          style={{
            fontSize: 24,
            // fontWeight: "bold",
            position: "absolute",
            bottom: 20,
            left: 30,
            color: "white",
            fontFamily: 'montserrat-semiBold'
          }}
        >
          {item.roomName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 2,
  },
  roomHeadingStyle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    position: "absolute",
    bottom: 75,
    left: 10,
  },

  imageStyle: {
    height: 270,
    opacity: 0.8,
    // height: screenHeight,
    // width: 330,
    width: screenWidth,
    marginHorizontal: 5,
    // marginLeft: 10
  },
});

export default RoomDetails;
