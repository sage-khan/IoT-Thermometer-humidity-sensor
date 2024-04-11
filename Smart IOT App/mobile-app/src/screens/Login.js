import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
// import { Text } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "../context/Context";
import { Button, Input, Form, Item, Icon, Spinner, Toast } from "native-base";
import axios from "axios";

const Login = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmpty, setIsEmpty] = useState("");
  const [visible, setVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // console.log("state.baseUrl", state.baseUrl);

  async function login() {
    let obj = {
      email: email,
      password: password,
    };
    try {
      let response = await axios.post(`${state.baseUrl}/auth/login`, obj, {
        withCredentials: true,
      });
      console.log("login response:", response.data);
      let userObj = response.data;
      await AsyncStorage.setItem("user", userObj.user.userName).catch((err) =>
        console.log(err),
      );
      await AsyncStorage.setItem("email", userObj.user.email).catch((err) =>
        console.log(err),
      );
      await AsyncStorage.setItem("id", userObj.user._id).catch((err) =>
        console.log(err),
      );

      setSpinner(false);
      Toast.show({
        style: styles.toastStyle,
        text: "Log In Successfull",
        type: "success",
      });
      navigation.reset({
        routes: [{ name: "TabStack" }],
      });
    } catch (error) {
      Toast.show({
        style: { ...styles.toastStyle },
        text: "Login Failed!",
        type: "danger",
      });
      console.log("login error", error);
      setSpinner(false);
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: state.blueLightTheme.gray,
      }}
    >
      <ImageBackground
        source={require("../../assets/form_bg-1.jpg")}
        style={{ ...styles.header }}
      />

      <Animatable.View animation="fadeInUpBig" style={styles.loginFormStyle}>
        <Text
          style={{
            ...styles.signupFormHeadingStyle,
            color: state.blueLightTheme.primary,
          }}
        >
          Let's Sign You In
        </Text>
        <Form>
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
            keyboardType='email-address'
            autoCapitalize='none'
            placeholder="Email" 
            value={email} onChangeText={setEmail} />
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
              value={password}
              onChangeText={setPassword}
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

        {error ? (
          <Text style={{ color: "red", marginLeft: 10, fontFamily: 'montserrat-regular' }}>{error}</Text>
        ) : (
          <Text style={{ color: "red", marginLeft: 10, fontFamily: 'montserrat-regular' }}>{isEmpty}</Text>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPwd")}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                color: state.blueLightTheme.primary,
                fontSize: 16,
                fontFamily: 'montserrat-regular',
                marginRight: 5,
                marginBottom: 10,
              }}
            >
              Forgot password?
            </Text>
          </View>
        </TouchableOpacity>
        <Button
          onPress={() => {
            setSpinner(true);
            if (email == "" || password == "") {
              setError("");
              setIsEmpty("Email and Password is required");
              setSpinner(false);
            } else {
              login();
            }
          }}
          block
          // transparent
          style={{
            ...styles.btnLoginStyle,
            backgroundColor: state.blueLightTheme.primary,
          }}
        >
          {spinner ? (
            <Spinner color="white" />
          ) : (
            <Text
              style={{
                ...styles.btnLoginTextStyle,
                color: "white",
              }}
            >
              Login
            </Text>
          )}
        </Button>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'montserrat-regular' }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <View>
              <Text
                style={{
                  ...styles.textSignupStyle,
                  color: state.blueLightTheme.primary,
                }}
              >
                Signup
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    // justifyContent: "center",
  },

  loginFormStyle: {
    flex: 3,
    marginTop: -35,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 15,
  },
  btnLoginStyle: {
    borderWidth: 3,
    borderRadius: 8,
    height: 50,
    marginHorizontal: 10,
  },
  textSignupStyle: {
    fontSize: 18,
    marginLeft: 5,
    // fontWeight: "700",
    fontFamily: 'montserrat-semiBold'
  },
  btnLoginTextStyle: {
    fontSize: 20,
    // fontWeight: "700",
    fontFamily: 'montserrat-semiBold'
  },
  headerChild: {
    borderColor: "white",
    borderWidth: 2,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  signupFormHeadingStyle: {
    marginVertical: 20,
    fontSize: 22,
    fontFamily: "montserrat-semiBold",
  },
  toastStyle: {
    borderRadius: 8,
    margin: 10,
  },
});

export default Login;
