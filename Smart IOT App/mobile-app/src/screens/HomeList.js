import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import { Card } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "../context/Context";
import { Button, Icon } from "native-base";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Loader from "../components/loader";
import HeaderComponent from "./Header";
import Modal from "../components/Modal";
import axios from "axios";
import HomeListComponent from "./HomeListComponent";
import { useIsFocused } from "@react-navigation/native";

const HomeList = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isHome, setIshome] = useState(false);
  const [userId, setUserId] = useState();
  const [spinner, setSpinner] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState("");

  const getHomes = async () => {
    setLoading(true);
    const _id = await AsyncStorage.getItem("id");
    setUserId(_id);
    axios
      .get(`${state.baseUrl}/homes?userId=${_id}`, { withCredentials: true })
      .then(async (response) => {
        console.log("home List: ", response.data);
        setData(response.data.reverse());
        setLoading(false);
        await AsyncStorage.removeItem(_id);
      })
      .catch((error) => {
        console.log('home list error: ', error.response);
        if (error.response.status === 400) {
          setData([]);
        }
        setLoading(false);
        setNoDataMessage(error.response.data.noDataMessage);
        error.response.data.noDataMessage !== '' ? AsyncStorage.setItem(_id, 'true') :  null;
      });
  };

  const deleteItem = async (item) => {
    try {
      setSpinner(true);
      const response = await axios.delete(`${state.baseUrl}/home/${item._id}`);
      setIshome(!isHome);
      setSpinner(false);
      await AsyncStorage.removeItem(item._id);
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
    getHomes();
  }, [state.refreshHomes, isHome, isFocused]);

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
            <Text style={{ color: "#fff", fontSize: 16 }}>Dismiss</Text>
          </Button>
        </View>
      </Modal>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <HeaderComponent
          title="Homes List"
          // back=""
          addIcon="add-to-list"
          // backAction=""
          addAction={() => {
            console.log("add button pressed");
            navigation.navigate("CreateHome", {
              userId: userId,
            });
          }}
        />
        {data && data?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <HomeListComponent
                navigation={navigation}
                item={item}
                spinner={spinner}
                handleDelete={() => deleteItem(item)}
              />
            )}
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              textTransform: "capitalize",
              fontFamily: 'montserrat-regular',
              marginTop: 'auto', marginBottom: 'auto',
              textAlign: 'center', color: 'gray', marginHorizontal: 20
            }}
          >
            {noDataMessage}
          </Text>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 10,
  },
  deleteBox: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 90,
    borderRadius: 5,
  },
});

export default HomeList;
