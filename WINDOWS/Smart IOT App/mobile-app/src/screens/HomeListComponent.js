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

const HomeListComponent = ({ item, handleDelete, navigation, spinner }) => {
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
    // console.log('homelistComponent data: ', item)
    return (
      <View style={styles.deleteBox}>
        <Animated.View
          style={{
            height: 80,
            width: 100,
            borderRadius: 5,
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            // flexDirection: "row",
            justifyContent: "center",
            transform: [{ scale: scale }],
            backgroundColor: state.blueLightTheme.primary,
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
          
          storeData(item._id, item.homeName);
          storeData("homeId", item._id);
          navigation.navigate("EachHome");
        }}
      >
        <Card containerStyle={{ minHeight: 100, borderRadius: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Icon
                style={{
                  fontSize: 50,
                  color: state.blueLightTheme.primary,
                }}
                type="FontAwesome"
                name="home"
              />
            </View>
            <View
              style={{
                flex: 4,
                borderLeftWidth: 1,
                paddingLeft: 10,
                borderLeftColor: state.blueLightTheme.gray,
              }}
            >
              <Text style={{ fontSize: 22, fontFamily: "montserrat-medium" }}>
                {item?.homeName}
              </Text>

              <View style={{ marginTop: 3 }}>
                <Text style={{fontFamily: 'montserrat-regular'}}>
                  Floors: {item?.floors.length}
                </Text>
                <Text style={{fontFamily: 'montserrat-regular'}}>
                  Water Tanks: {item?.tanks.length}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteBox: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 90,
    borderRadius: 5,
  },
});
export default HomeListComponent;
