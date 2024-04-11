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

const FloorListComponent = ({ item, handleDelete, prop, spinner }) => {
  let { state } = useContext(GlobalContext);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

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
          storeData("floorId", item._id);
          storeData("floorName", item.floorName);
          // console.log('floorname in floorlsit: ', item.floorName)
          prop.navigation.reset({
            routes: [{ name: "Home" }],
          });
        }}
      >
        <Card containerStyle={{ minHeight: 80, borderRadius: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Icon
                style={{
                  fontSize: 50,
                  color: state.blueLightTheme.primary,
                }}
                type="MaterialIcons"
                name="apartment"
              />
            </View>
            <View style={{ flex: 4 }}>
              {/* <Text style={{ fontSize: 22, fontWeight: "700" }}> */}
              <Text style={{ fontSize: 22, fontFamily: "montserrat-semiBold" }}>
                {item.floorName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "300",
                  marginTop: 3,
                  fontFamily: 'montserrat-regular'
                }}
              >
                Rooms: {item.rooms.length}
              </Text>
            </View>

            {/* <Image source={require('../../assets/floorImage1.png')} style={{width: 60, height: 65, position: "absolute", right: 15, top: 0}} /> */}
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default FloorListComponent;

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
