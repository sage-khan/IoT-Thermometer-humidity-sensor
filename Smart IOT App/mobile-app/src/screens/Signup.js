import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Keyboard,
  ImageBackground,
} from "react-native";
import * as Animatable from "react-native-animatable";
import request from "../components/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "../context/Context";
import { Button, Input, Form, Item, Icon, Toast, Spinner } from "native-base";
import { Snackbar } from "react-native-paper";
import axios from "axios";

const Signup = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [isEmpty, setIsEmpty] = useState("");
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isEmail, setIsEmail] = useState('');

  function signup() {

    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    Keyboard.dismiss();
    if(re.test(email) == false){
      setSpinner(false);
      setIsEmpty('');
      return setIsEmail('Email is not valid!');
    }

    setIsEmail('');
    const obj = {
      email: email,
      userName: name,
      password: pwd,
    };

    axios.post(`${state.baseUrl}/auth/signup`, obj).then(
      (response) => {
        console.log(response.data);
        storeData("is_user_exist", "true");
        Toast.show({
          style: styles.toastStyle,
          text: "Account Created Successfully!",
          type: "success",
        });
        setSpinner(false);
        navigation.navigate("Login");
      },
      (error) => {
        setIsEmpty("");
        Toast.show({
          style: { ...styles.toastStyle },
          text: "Submission Failed!",
          type: "danger",
        });
        console.log(error);
        setSpinner(false);
        // setError("Please, provide correct information");
      },
    );
  }

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: state.blueLightTheme.gray,
      }}
    >
      {/* <View style={{ ...styles.headerStyle, backgroundColor: state.blueLightTheme.primary }}>
        <View style={styles.headerChild}>
          <Text style={{ ...styles.headerTextStyle, color: state.blueLightTheme.primary }}>Signup</Text>
        </View>
      </View> */}
      <ImageBackground
        source={require("../../assets/form_bg-1.jpg")}
        style={{ ...styles.headerStyle }}
      />
      <Animatable.View animation="fadeInUpBig" style={styles.singupFormStyle}>
        <Text
          style={{
            ...styles.signupFormHeadingStyle,
            color: state.blueLightTheme.primary,
          }}
        >
          Create Your Account
        </Text>
        <Form>
          <Item
            error={isEmpty != "" ? true : false}
            style={{ borderBottomWidth: 2 }}
          >
            <Icon
              type="FontAwesome"
              name="user"
              style={{ color: state.blueLightTheme.primary }}
            />
            <Input
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            {isEmpty ? (
              <Icon type="MaterialIcons" name="error-outline" />
            ) : null}
          </Item>
          <Item
            error={isEmpty != "" ? true : false}
            style={{ borderBottomWidth: 2 }}
          >
            <Icon
              type="MaterialCommunityIcons"
              name="email"
              style={{ color: state.blueLightTheme.primary }}
            />
            <Input
            autoCapitalize='none'
            keyboardType='email-address'
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            {isEmpty ? (
              <Icon type="MaterialIcons" name="error-outline" />
            ) : null}
          </Item>
          <Item
            error={isEmpty != "" ? true : false}
            style={{ borderBottomWidth: 2 }}
          >
            <Icon
              type="FontAwesome"
              name="lock"
              style={{ color: state.blueLightTheme.primary }}
            />
            <Input
              placeholder="Password"
              secureTextEntry={visible ? false : true}
              value={pwd}
              onChangeText={setPwd}
            />
            <Icon
              onPress={() => setVisible(!visible)}
              type="Feather"
              name={visible ? "eye" : "eye-off"}
            />
            {isEmpty ? (
              <Icon type="MaterialIcons" name="error-outline" />
            ) : null}
          </Item>
        </Form>

        {isEmpty ? (
          <Text style={styles.errorStyle}>
            {isEmpty}
          </Text>
        ) : (
          <Text style={styles.errorStyle}>
            {error}
          </Text>
        )}

        {isEmail ? <Text style={styles.errorStyle}>{isEmail}</Text> : null}
        <Button
          onPress={() => {
            setSpinner(true);
            if (email == "" || pwd == "" || name == "") {
              setError("");
              setIsEmpty("All inputs are required to be filled!");
              setSpinner(false);
            } else {
              signup();
              // validateEmail();
            }
          }}
          block
          style={{
            ...styles.btnSignupStyle,
            backgroundColor: state.blueLightTheme.primary,
          }}
        >
          {spinner ? (
            <Spinner color="white" />
          ) : (
            <Text
              style={{
                ...styles.btnSignupTextStyle,
                color: "white",
              }}
            >
              Signup
            </Text>
          )}
        </Button>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'montserrat-regular' }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                ...styles.loginTextStyle,
                color: state.blueLightTheme.primary,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  singupFormStyle: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: -35,
    marginHorizontal: 15,
    // justifyContent: "space-around"
  },
  headerStyle: {
    flex: 2,
    // justifyContent: 'center'
  },
  headerChild: {
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  // headerTextStyle: {
  //   fontSize: 30,
  //   fontFamily: 'montserrat-semiBold'
  // },
  loginTextStyle: {
    fontSize: 18,
    // fontWeight: "700",
    marginLeft: 5,
    fontFamily: 'montserrat-semiBold'
  },
  btnSignupTextStyle: {
    fontSize: 18,
    // fontWeight: "700",
    fontFamily: 'montserrat-semiBold'
  },
  btnSignupStyle: {
    borderWidth: 3,
    borderRadius: 8,
    height: 50,
    marginHorizontal: 10,
  },
  signupFormHeadingStyle: {
    marginVertical: 20,
    fontSize: 22,
    // fontWeight: "700",
    fontFamily: 'montserrat-semiBold'
  },
  toastStyle: {
    borderRadius: 8,
    margin: 10,
  },
  errorStyle: {
    color: "red", 
    marginLeft: 10, marginBottom: 5, 
    fontFamily: 'montserrat-regular'
  }
});

export default Signup;
