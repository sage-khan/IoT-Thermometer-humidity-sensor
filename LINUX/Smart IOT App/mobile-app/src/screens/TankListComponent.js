import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "../context/Context";
import { IconButton, Button, Icon } from "native-base";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Spinner } from "native-base";
import axios from "axios";

const TankListComponent = ({ item, handleDelete, prop, spinner }) => {
  let { state } = useContext(GlobalContext);
  let tankId = "611e3ea04209765530fae5c4";
  const [reading, setReading] = useState(0);
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

  function getWaterLevel() {
    axios
      .get(`${state.baseUrl}/waterlevel?tankId=${tankId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("REsponse", res.data[0]);
        let actualReading = res.data[0]?.waterLevel;
        // console.log("actualReading", actualReading);
        let parsedReading = 210 - actualReading;
        parsedReading = parsedReading / 2;
        // console.log("parsedReading", parsedReading);
        if (parsedReading > 100) {
          setReading(100);
        }
        if (parsedReading < 0) {
          setReading(0);
        } else {
          setReading(parsedReading.toFixed(0));
        }
      })
      .catch((error) => {
        console.log("Error in eachTank.js", error);
      });
  }
  // console.log("Reading", reading);
  useEffect(() => {
    getWaterLevel();
  }, []);

  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.deleteBox}>
        <Animated.View
          style={{
            transform: [{ scale: scale }],
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: state.blueLightTheme.primary,
            width: 100,
            height: 70,
            borderRadius: 5,
            marginBottom: 15,
            overflow: "hidden",
          }}
        >
          <Button
            onPress={handleDelete}
            style={{
              backgroundColor: "#F44336",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: 100,
            }}
            startIcon={
              <Icon
                // style={{ fontSize: 30, color: "#fff" }}
                type="FontAwesome"
                name="trash"
                // as={MaterialCommunityIcons}
                size={2}
              />
            }
          >
            {spinner ? (
              <Spinner color="white" style={{ fontSize: 27, color: "#fff" }} />
            ) : (
              <Icon
                style={{ fontSize: 27, color: "#fff" }}
                type="FontAwesome"
                name="trash"
              />
            )}
          </Button>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={rightSwipe}>
      <TouchableOpacity
        onPress={() => {
          console.log("button pressed");
          prop.navigation.navigate("EachTank", {
            id: item._id,
          });
        }}
      >
        <Card containerStyle={{ minheight: 80, borderRadius: 5 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Icon
                style={{
                  fontSize: 50,
                  color: state.blueLightTheme.primary,
                }}
                type="MaterialCommunityIcons"
                name="tower-fire"
              />
            </View>
            <View style={{ flex: 4 }}>
              <Text style={{ fontSize: 22, fontFamily: "montserrat-semiBold" }}>
                {item.tankName}
                {/* Tank1 */}
              </Text>
              <Text style={{ fontSize: 16, fontFamily: 'montserrat-medium' }}>
                Level: {reading}%
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default TankListComponent;
const styles = StyleSheet.create({
  deleteBox: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 90,
    borderRadius: 5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 10,
  },
});
