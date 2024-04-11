import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import request from "../components/api";
import { FAB, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Drawer, Container, Button } from "native-base";
import Sidebar from "./Sidebar";
import { GlobalContext } from "../context/Context";
import HeaderComponent from "./Header";
import Loader from "../components/loader";
import RoomDetails from "./RoomDetails";
import axios from "axios";

const EachFloor = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [homeName, setHomeName] = useState();
  const [floorName, setFloorName] = useState();
  const [loading, setLoading] = useState(false);
  const [floorId, setFloorId] = useState();
  const [isRooms, setIsRooms] = useState(false);
  const [userName, setUsername] = useState();
  const [noDataMessage, setNoDataMessage] = useState("");
  async function deleteRoom(roomData) {
    try {
      const response = await axios.delete(
        `${state.baseUrl}/room/${roomData._id}`,
      );
      // console.log("delete response", response.data);
      setIsRooms(!isRooms);
    } catch (error) {
      console.log("Error is", error);
    }
  }

  // Floating Action Button
  const [value, setValue] = useState({ open: false });
  const onStateChange = ({ open }) => {
    // console.log("open", open);
    setValue({ open });
  };
  const { open } = value;
  const [active, setActive] = useState(false);

  // Get All Rooms Api
  async function getRooms(floorid) {
    try {
      setLoading(true);
      setRooms([]);
      const response = await request.get(`/rooms?floorId=${floorid}`, {
        withCredentials: true,
      });
      // console.log("Server response=======>: ", response);
      setLoading(false);
      if (Array.isArray(response.data)) {
        setRooms(response.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }
  // console.log("loading", rooms);
  // User Logout APi
  function logout() {
    request.post("/auth/logout").then(
      (response) => {
        // console.log(response.data);
        // navigation.navigate('Login')
      },
      (error) => {
        console.log(error);
      },
    );
  }
  async function getData() {
    const homeNameAsync = await AsyncStorage.getItem("homeName");
    const floorIdAsync = await AsyncStorage.getItem("floorId");
    const userNameAsync = await AsyncStorage.getItem("user");
    const floorNameAsync = await AsyncStorage.getItem("floorName");
    // console.log("floor name:", floorNameAsync);

    setHomeName(homeNameAsync);
    setFloorId(floorIdAsync);
    setUsername(userNameAsync);
    setFloorName(floorNameAsync);
    setLoading(true);
    // console.log("Home Name: ", homeNameAsync);
    // console.log("eachfloor.js Floor id: ", floorIdAsync);

    // const floorId = await AsyncStorage.getItem('floorId');
    axios
      .get(`${state.baseUrl}/rooms?floorId=${floorIdAsync}`, {
        withCredentials: true,
      })
      .then((response) => {
        setRooms(response.data.reverse());
        setNoDataMessage(response.data.noDataMessage);
        setLoading(false);
      })
      .catch((error) => setLoading(false));
  }

  useEffect(() => {
    getData();
  }, [state.refreshRooms, isRooms]);

  return (
    <Drawer
      ref={(ref) => {
        navigation.drawer = ref;
      }}
      content={
        <Sidebar
          navigation={navigation}
          closeDrawer={() => navigation.drawer._root.close()}
          floorName={floorName}
        />
      }
      onClose={() => navigation.drawer._root.close()}
    >
      <Loader loading={loading} />
      <Provider>
        <Container
          style={{
            flex: 1,
          }}
        >
          <HeaderComponent
            title={floorName}
            backIcon="menu"
            backAction={() => navigation.drawer._root.open()}
            addIcon="plus"
            addAction={() => {
              navigation.navigate("CreateRoom", {
                floorId: floorId,
              });
            }}
          />
          <ImageBackground
            source={require("../../assets/form_bg-1.jpg")}
            style={styles.headerView}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginLeft: 20,
              }}
            >
              Hi, {userName}
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 20,
                color: "white",
                marginLeft: 20,
              }}
            >
              You are in {homeName}
            </Text>
          </ImageBackground>
          <View
            style={{
              flex: 2,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              marginTop: -20,
              backgroundColor: "white",
            }}
          >
            {rooms && rooms.length > 0 ? (
              <View style={styles.corouselViewStyle}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {rooms &&
                    rooms.map((item, index) => {
                      return (
                        <RoomDetails
                          key={index}
                          item={item}
                          navigation={navigation}
                          deleteRoom={deleteRoom}
                          isRooms={isRooms}
                        />
                      );
                    })}
                </ScrollView>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {noDataMessage}
                </Text>
              </View>
            )}

            <Button
              block
              onPress={() => navigation.navigate("PipelineList")}
              style={{
                ...styles.pipelineBtnStyle,
                backgroundColor: state.blueLightTheme.primary,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  letterSpacing: 3,
                }}
              >
                Pipelines
              </Text>
            </Button>
          </View>

          {/* <FAB.Group
            fabStyle={{
              backgroundColor: state.blueLightTheme.primary,
              // alignSelf: "center",
              // position: 'absolute',
              // bottom: -30
            }}
            open={open}
            icon="plus"
            color="white"
            actions={[
              {
                style: { backgroundColor: state.blueLightTheme.secondary },
                icon: "plus",
                label: "Create Pipeline",
                onPress: () => {
                  navigation.navigate("CreatePipeline", {
                    floorId: floorId,
                  });
                },
              },
              {
                style: { backgroundColor: state.blueLightTheme.secondary },
                icon: "plus",
                label: "Create Room",
                onPress: () => {
                  // console.log("floorid in floorScreen: ", rooms.floorId);
                  navigation.navigate("CreateRoom", {
                    floorId: floorId,
                  });
                },
              },
            ]}
            onStateChange={onStateChange}
          /> */}
        </Container>
      </Provider>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  roomHeadingStyle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    position: "absolute",
    bottom: 75,
    left: 15,
  },
  corouselViewStyle: {
    marginTop: 15,
    // marginLeft: 15,
    // marginHorizontal: 10,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  pipelineBtnStyle: {
    width: "95%",
    height: 45,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    marginTop: "auto",
    marginBottom: 12,
  },
});

export default EachFloor;
