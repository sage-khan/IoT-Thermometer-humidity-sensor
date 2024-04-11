import request from "../components/api";
import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
// import { Input, Button } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { GlobalContext } from "../context/Context";
import HeaderComponent from "./Header";
import { Input, Button, Form, Item, Toast, Icon } from "native-base";
import axios from "axios";

const NewPassword = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmpty, setIsEmpty] = useState("");

  async function submit() {
    try {
      const data = {
        email: email,
        newPassword: password,
        otpCode: code,
      };
      let response = await axios.post(
        `${state.baseUrl}/auth/forget-password-step-2`,
        data,
      );
      // console.log("response", response);
      if (response.status === 200) {
        Toast.show({
          style: styles.toastStyle,
          text: "Password updated successfully. Please Login to continue.",
          type: "success",
        });
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2500);
      }
    } catch (error) {
      console.log(error);
      const { response } = error;
      if (response.status === 403) {
        Toast.show({
          style: { ...styles.toastStyle },
          text: "Account does not exist!",
          type: "danger",
        });
      }
      if (response.status === 401) {
        Toast.show({
          style: { ...styles.toastStyle },
          text: "Please enter a valid code!",
          type: "danger",
        });
      }
    }
  }

  function validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function handleChange(email) {
    setEmail(email);
    if (email) {
      setEmailError("");
    }
  }
  return (
    <View style={styles.parentViewStyle}>
      <HeaderComponent
        title="Forgot Password"
        iconName="arrow-back"
        action={() => navigation.goBack()}
      />
      <View style={styles.childViewStyle}>
        <Form>
          <Item
            error={isEmpty != "" ? true : false}
            style={{ borderBottomWidth: 2 }}
          >
            <Input
              placeholder="Enter code"
              value={code}
              onChangeText={setCode}
            />
            {isEmpty ? <Icon type="MaterialIcons" name="error" /> : null}
          </Item>
          <Item
            error={isEmpty != "" ? true : false}
            style={{ borderBottomWidth: 2 }}
          >
            <Input
              placeholder="Enter email"
              value={email}
              onChangeText={(inputValue) => handleChange(inputValue)}
            />
            {isEmpty ? <Icon type="MaterialIcons" name="error" /> : null}
          </Item>
          {emailError ? (
            <Text
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginHorizontal: 20,
                // marginVertical: 10,
                marginBottom: 0,
              }}
            >
              {emailError}
            </Text>
          ) : null}
          <Item
            error={isEmpty != "" ? true : false}
            style={{ borderBottomWidth: 2 }}
          >
            <Input
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
            />
            {isEmpty ? <Icon type="MaterialIcons" name="error" /> : null}
          </Item>

          {isEmpty ? (
            <Text
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginHorizontal: 20,
                // marginVertical: 10,
              }}
            >
              {isEmpty}
            </Text>
          ) : null}
          <Button
            onPress={() => {
              if (code == "" || password == "") {
                setIsEmpty("All fields are required. To process request.");
              }
              if (!validateEmail(email)) {
                setEmailError("Please enter valid email");
              } else {
                submit();
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

    // <View style={styles.container}>
    //   <HeaderCompnent title="New Password" iconName="arrow-back" action={()=> navigation.goBack()} />
    //   <Animatable.View animation="fadeInUpBig" delay={0} style={styles.footer}>
    //     <Input
    //       placeholder="Enter Code"
    //       leftIcon={{ type: "MaterialCommunityIcons", name: "email", size: 20 }}
    //       value={code}
    //       onChangeText={setCode}
    //     />

    //     <Input
    //       placeholder="Enter new password"
    //       leftIcon={{ type: "Entypo", name: "lock", size: 20 }}
    //       value={password}
    //       onChangeText={setPassword}
    //     />
    //     <Input
    //       placeholder="Confirm your password"
    //       leftIcon={{ type: "Entypo", name: "lock", size: 20 }}
    //       value={confirmPassword}
    //       onChangeText={setConfirmPassword}
    //     />

    //     {isEmpty ? (
    //       <Text
    //         style={{
    //           color: "red",
    //           alignSelf: "flex-start",
    //           marginHorizontal: 10,
    //         }}
    //       >
    //         {isEmpty}
    //       </Text>
    //     ) : null}

    //     <TouchableOpacity
    //       // raised={true}
    //       onPress={() => {
    //         if (code === "" || password === "" || confirmPassword === "") {
    //           //   setError("");
    //           setIsEmpty("All input fields are required and can not be empty");
    //         } else {
    //           // submit();
    //           console.log("password change successfully");
    //         }
    //       }}
    //     >
    //       <View style={{...styles.submit, backgroundColor: state.blueLightTheme.primary}}>
    //         <Text style={styles.submitText}>Submit</Text>
    //       </View>
    //     </TouchableOpacity>
    //   </Animatable.View>
    // </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // backgroundColor: "#E7d08dFF",
  //   // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  // },

  // footer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   backgroundColor: "#fff",
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  // },

  // submit: {
  //   width: "100%",
  //   height: 45,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 50,
  //   flexDirection: "row",
  //   // backgroundColor: state.blueLightTheme.primary,
  // },
  // submitText: {
  //   color: "white",
  //   fontWeight: "bold",
  //   fontSize: 16,
  //   marginRight: 4,
  // },

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
    fontWeight: "700",
  },
});

export default NewPassword;
