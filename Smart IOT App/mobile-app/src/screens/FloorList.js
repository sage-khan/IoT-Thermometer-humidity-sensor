import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  Animated,
} from "react-native";
import { Card } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import request from "../components/api";
import { Left, Icon, Button } from "native-base";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GlobalContext } from "../context/Context";
import { FAB } from "react-native-paper";
import Loader from "../components/loader";
import Modal from "../components/Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FloorListComponent from "./FloorListComponent";

const FloorScreen = ({ prop }) => {
  let { state } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [deleteWarning, setDeleteWarning] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isFloor, setIsfloor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [spinner, setSpinner] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");

  const getFloors = async () => {
    setLoading(true);
    const homeId = await AsyncStorage.getItem("homeId").catch((err) =>
      console.log("storage error: ", err),
    );

    if (homeId != null) {
      setId(homeId);
      axios
        .get(`${state.baseUrl}/floors?homeId=${homeId}`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("floorslist res", response.data);
          setData(response.data.reverse());
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            setData([]);
          }
          setLoading(false);
          setNoDataMessage(error.response.data.noDataMessage);
          console.log("Error in FloorList.js", error);
        });
    }
  };

  const deleteItem = async (item) => {
    try {
      setSpinner(true);
      const response = await axios.delete(`${state.baseUrl}/floor/${item._id}`);
      setIsfloor(!isFloor);
      setSpinner(false);
    } catch (error) {
      const { response } = error;
      if (response.status === 400) {
        setSpinner(false);
        setDeleteWarning(response.data.noDataMessage);
        setIsVisible(true);
      }
      console.log("Error is", error);
    }
  };

  useEffect(() => {
    getFloors();
  }, [state.refreshFloors, isFloor]);

  return (
    <>
      <Loader loading={loading} />
      <Modal isModalVisible={isVisible}>
        <View>
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: 16,
              textAlign: "center",
              fontFamily: 'montserrat-regular'
            }}
          >
            {deleteWarning}
          </Text>
        </View>

        <View style={{ marginTop: 15 }}>
          <Button
            small
            danger
            style={{
              borderRadius: 8,
              paddingTop: 20,
              padding: 20,
              paddingBottom: 20,
            }}
            onPress={() => setIsVisible(false)}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: 'montserrat-regular' }}>Dismiss</Text>
          </Button>
        </View>
      </Modal>

      <SafeAreaView
        style={{
          flex: 1,
          // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}
      >
        {data && data.length ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <FloorListComponent
                prop={prop}
                item={item}
                spinner={spinner}
                handleDelete={() => deleteItem(item)}
              />
            )}
          />
        ) : (
          // <View
          //   style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          // >
            <Text
              style={{
                fontSize: 16,
                textTransform: "capitalize",
                fontFamily: 'montserrat-medium',
                marginTop: 'auto', marginBottom: 'auto',
                color: 'gray',
                textAlign: 'center'
              }}
            >
              {noDataMessage}
            </Text>
          // </View>
        )}
        <FAB
          style={{
            ...styles.fab,
            backgroundColor: state.blueLightTheme.primary,
          }}
          large
          // label="Create Floor"
          icon="plus"
          color="white"
          onPress={() => {
            console.log("button pressed");
            prop.navigation.navigate("CreateFloor", {
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

export default FloorScreen;
