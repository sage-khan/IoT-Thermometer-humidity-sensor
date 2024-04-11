import request from "../components/api";
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { Input, Button, Form, Item, Toast, Icon } from "native-base";
import { GlobalContext } from "../context/Context";
import HeaderComponent from "./Header";
import axios from "axios";

const CreateRoom = ({ route, navigation }) => {
  const { floorId } = route.params;
  let { state, dispatch } = useContext(GlobalContext);
  const [name, setName] = useState();
  const [isEmpty, setIsEmpty] = useState();

  async function create() {
    let obj = {
      floorId: floorId,
      roomName: name,
    };
    try {
      let response = await axios.post(`${state.baseUrl}/room`, obj, {
        withCredentials: true,
      });
      // console.log("response from create room:", response.data);
      dispatch({
        type: "CREATE_ROOM",
      });
      Toast.show({
        style: { ...styles.toastStyle },
        text: "Room Created Successfully!",
        type: "success",
      });
      navigation.goBack();
    } catch (error) {
      // console.log("error from create room: ", error);
      Toast.show({
        style: { ...styles.toastStyle },
        text: "Submission Failed!",
        type: "danger",
      });
    }
  }

  return (
    <View style={styles.parentViewStyle}>
      <HeaderComponent
        title="Create Room"
        backIcon="arrow-back"
        backAction={() => navigation.goBack()}
      />
      <View style={styles.childViewStyle}>
        <Form>
          <Item
            error={isEmpty != "" ? false : true}
            style={{ borderBottomWidth: 2 }}
          >
            <Input
              placeholder="Enter Room Name"
              value={name}
              onChangeText={setName}
            />
            {isEmpty ? <Icon type="MaterialIcons" name="error" /> : null}
          </Item>
          {isEmpty ? (
            <Text
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginHorizontal: 20,
                marginVertical: 10,
                fontFamily: 'montserrat-regular'
              }}
            >
              {isEmpty}
            </Text>
          ) : null}
          <Button
            onPress={() => {
              if (name == "") {
                setIsEmpty("Name can not be empty!");
              } else {
                create();
              }
            }}
            block
            style={{
              ...styles.btnStyle,
              backgroundColor: state.blueLightTheme.primary,
            }}
          >
            <Text style={styles.btnTextStyle}>Submit</Text>
          </Button>
        </Form>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentViewStyle: {
    flex: 1,
    justifyContent: "center",
  },
  childViewStyle: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  toastStyle: {
    borderRadius: 8,
    margin: 10,
  },
  btnStyle: {
    borderRadius: 8,
    margin: 20,
  },
  btnTextStyle: {
    fontSize: 18,
    color: "white",
    // fontWeight: "700",
    fontFamily: 'montserrat-regular'
  },
});

export default CreateRoom;
