import request from "../components/api";
import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform, StatusBar } from "react-native";
import { Input, Button, Form, Item, Toast, Icon } from 'native-base'
import * as Animatable from "react-native-animatable";
import { GlobalContext } from '../context/Context';
import HeaderComponent from "./Header";
import axios from "axios";

const CreateHome = ({ route, navigation }) => {
  let { state, dispatch } = useContext(GlobalContext);
  // console.log(state);
  const { userId } = route.params;
  const [name, setName] = useState("");
  const [isEmpty, setIsEmpty] = useState("");

  // console.log('userId', userId);


  function create() {
    let obj = {
      homeName: name,
      userId: userId,
    };

    axios.post(`${state.baseUrl}/home`, obj).then(
      (response) => {
        // console.log(response.data);
        dispatch({
          type: "CREATE_HOME",
        })
        Toast.show({
          style: styles.toastStyle,
          text: 'Home Created Successfully!',
          type: 'success'
        })
        navigation.goBack();
      },
      (err) => { 
        console.log(err)
        Toast.show({
          style: { ...styles.toastStyle },
          text: 'Submission Failed!',
          type: "danger"
        }) 
      }
    );
  }

  return (

    <View style={styles.parentViewStyle}>
      <HeaderComponent title="Create Home" backIcon="arrow-back" backAction={() => navigation.goBack()} />
      {/* <Image
          style={styles.imageStyle}
          source={require("../../assets/home.gif")}
        /> */}
      <View style={styles.childViewStyle}>
        <Form>
          <Item error={isEmpty != "" ? true : false} style={{ borderBottomWidth: 2 }}>
            <Input
              placeholder="Enter Home Name"
              value={name}
              onChangeText={setName} />
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
                setIsEmpty("Name can not be empty!")
              } else {
                create();
              }
            }}
            block
            style={{ ...styles.btnStyle, backgroundColor: state.blueLightTheme.primary }}>
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
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  toastStyle: {
    borderRadius: 8, margin: 10
  },
  btnStyle: {
    borderRadius: 8, margin: 20
  },
  btnTextStyle: {
    fontSize: 18,
    color: 'white',
    // fontWeight: '700'
    fontFamily: 'montserrat-regular'
  }
});

export default CreateHome;
