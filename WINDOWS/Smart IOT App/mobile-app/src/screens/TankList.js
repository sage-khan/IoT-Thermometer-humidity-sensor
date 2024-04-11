import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { Card } from "react-native-elements";
import request from "../components/api";
import { Left, Icon } from "native-base";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GlobalContext } from "../context/Context";
import { FAB } from "react-native-paper";
import Loader from "../components/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TankListComponent from "./TankListComponent";

const TankScreen = ({ prop }) => {
  // const { homeId } = props;
  // console.log("homeid in tankList: ", homeId);
  // const newProp = props.props;
  let { state } = useContext(GlobalContext);
  const [tanks, setTanks] = useState([]);
  const [tankId, setTankId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTank, setIstank] = useState(false);
  const [id, setId] = useState();
  const [spinner, setSpinner] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");

  async function getTanks() {
    setLoading(true);
    const _id = await AsyncStorage.getItem("homeId");
    if (_id != null) {
      setId(_id);
      // console.log('homeid in tanks res', _id);
      axios
        .get(`${state.baseUrl}/watertanks?homeId=${_id}`, {
          withCredentials: true,
        })
        .then(
          (response) => {
            console.log("Tank list: ", response.data);
            // if (Array.isArray(response.data)) {
            setTanks(response.data.reverse());
            setLoading(false);
            // }
            // setLoading(false);
          },
          (error) => {
            if (error.response.status === 404) {
              setTanks([]);
            }
            setLoading(false);
            setNoDataMessage(error.response.data.noDataMessage);
          },
        );
    }
  }

  const deleteItem = async (item) => {
    try {
      setSpinner(true);
      const response = await axios.delete(`${state.baseUrl}/tank/${item._id}`);
      setIstank(!isTank);
      setSpinner(false);
      // if (response.status === 200) {
      //   const arr = [...tanks];
      //   arr.splice(item.index, 1);
      //   setTanks(arr);
      // }
    } catch (error) {
      setSpinner(false);
      console.log("Error is", error);
    }
  };

  useEffect(() => {
    getTanks();
  }, [state.refreshTanks, isTank]);

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
          <View
            style={{
              backgroundColor: "#F44336",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "50%",
            }}
          >
            <Icon
              style={{ fontSize: 30, color: "#fff" }}
              type="FontAwesome"
              name="trash"
              onPress={() => deleteItem(tankId)}
            />
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 70,
              width: "50%",
            }}
          >
            <Icon
              style={{ fontSize: 30, color: "#fff" }}
              type="FontAwesome"
              name="edit"
              // onPress={() => setModalVisible(true)}
            />
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      {/* <Loader loading={loading} /> */}
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        {tanks && tanks.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={tanks}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <TankListComponent
                prop={prop}
                item={item}
                spinner={spinner}
                // storeData={() => storeData()}
                handleDelete={() => deleteItem(item)}
              />
            )}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'montserrat-medium',
                textTransform: "capitalize",
                marginBottom: 'auto', marginTop: 'auto',
                textAlign: 'center', color: 'gray'
              }}
            >
              {noDataMessage}
            </Text>
          </View>
        )}
        <FAB
          style={{
            ...styles.fab,
            backgroundColor: state.blueLightTheme.primary,
          }}
          large
          // label="Create Tank"
          icon="plus"
          color="white"
          onPress={() => {
            // console.log("button pressed");
            prop.navigation.navigate("CreateTank", {
              homeId: id,
            });
          }}
        />
      </SafeAreaView>
    </>
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 10,
  },
});

export default TankScreen;
