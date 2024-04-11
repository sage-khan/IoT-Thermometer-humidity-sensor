import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
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
import HeaderComponent from "./Header";
import axios from "axios";
import PipeLineListComponent from "./PipeLineListComponent";

const PipelineList = ({ navigation }) => {
  let { state, dispatch } = useContext(GlobalContext);
  const [pipelines, setPipelines] = useState([]);
  const [floorId, setFloorId] = useState();
  const [loading, setLoading] = useState(false);
  const [isPipeline, setIsPipeline] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // const [floorId, setFloorId] = useState();

  async function getData() {
    try {
      const floor_id = await AsyncStorage.getItem("floorId");
      if (floor_id != null) {
        // console.log("Floor id: ", floor_id);
        setFloorId(floor_id);
        getPipeLines(floor_id);

      }
    } catch (error) {
      console.log(error);
    }
  }

  function getPipeLines(id) {
    setLoading(true);
    axios
      .get(`${state.baseUrl}/pipelines?floorId=${id}`, {
        withCredentials: true,
      })
      .then(
        (response) => {
          // console.log("pipeLines res", response.data);
          setPipelines(response.data.reverse());
          setLoading(false);
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

  const deleteItem = async (item) => {
    try {
      setSpinner(true);
      const response = await axios.delete(
        `${state.baseUrl}/pipeline/${item._id}`,
      );
      setIsPipeline(!isTank);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      console.log("Error is", error);
    }
  };

  useEffect(() => {
    getData();
  }, [state.refreshPipelines, isPipeline]);

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
              onPress={() => deleteItem(floorId)}
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
      <Loader loading={loading} />
      <Modal isModalVisible={isVisible}>
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
        }}
      >
        <HeaderComponent
          title="Pipeline List"
          backIcon="arrow-back"
          addIcon="add-to-list"
          addAction={()=> {
            console.log('hello')
              navigation.navigate("CreatePipeline", {
                floorId: floorId
              });
          }}
          backAction={() => navigation.goBack()}
        />
        {pipelines && pipelines.length >= 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={pipelines}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <PipeLineListComponent
                navigation={navigation}
                item={item}
                spinner={spinner}
                // storeData={() => storeData()}
                handleDelete={() => deleteItem(item)}
              />
            )}
          />
        ) : (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontFamily: 'montserrat-medium' }}>
              Create Your PipeLines Here..
            </Text>
          </View>
        )}
        {/* <FAB
          style={{
            ...styles.fab,
            backgroundColor: state.blueLightTheme.primary,
          }}
          large
          label="Create Floor"
          icon="plus"
          color="white"
          onPress={() => {
            console.log("button pressed");
            newProp.navigation.navigate("CreateFloor", {
              homeId: homeId,
            });
          }}
        /> */}
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
    // backgroundColor: state.blueLightTheme.primary,
  },
});

export default PipelineList;
