import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
// import { Input, Button } from "react-native-elements";
import request from "../components/api";
import * as Animatable from "react-native-animatable";
import { GlobalContext } from "../context/Context";
import HeaderComponent from "./Header";
import { Input, Button, Form, Item, Toast, Icon } from "native-base";
import axios from "axios";

const ForgotPassword = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [isEmpty, setIsEmpty] = useState("");

  async function forgotPassword() {
    try {
      let response = await axios.post(`${state.baseUrl}/auth/forget-password`, {
        email,
      });
      if (response.status === 200) {
        Toast.show({
          style: styles.toastStyle,
          text: "Opt code send. Check your email.",
          type: "success",
        });
        setTimeout(() => {
          navigation.navigate("NewPassword");
        }, 2500);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        style: { ...styles.toastStyle },
        text: "Account does not exist!",
        type: "danger",
      });
    }
  }

  function validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function handleChange(email) {
    console.log(email);
    setEmail(email);
    if (email) {
      setIsEmpty("");
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
              placeholder="Enter your email"
              value={email}
              onChangeText={(inputValue) => handleChange(inputValue)}
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
                fontFamily: "montserrat-regular",
              }}
            >
              {isEmpty}
            </Text>
          ) : null}
          <Button
            onPress={() => {
              // if (email == "") {
              //   setIsEmpty("Please enter email");
              // }
              if (!validateEmail(email)) {
                setIsEmpty("Please enter valid email");
              } else {
                forgotPassword();
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
    //   <HeaderCompnent title="Reset Password" iconName="arrow-back" action={()=> navigation.goBack()} />
    //   <Animatable.View animation="fadeInUpBig" delay={0} style={styles.footer}>
    //     <View>
    //       <Text style={styles.text_header}>
    //         Enter your Email to Restore Your Account
    //       </Text>
    //     </View>
    //     <View>
    //       <Input
    //         placeholder="Enter your Email"
    //         leftIcon={{ type: "MaterialCommunityIcons", name: "email" }}
    //         value={email}
    //         onChangeText={setEmail}
    //       />

    //       {isEmpty ? (
    //         <Text style={{ color: "red", fontSize: 16, marginHorizontal: 10 }}>
    //           {isEmpty}
    //         </Text>
    //       ) : null}

    //       <TouchableOpacity
    //         style={{ marginTop: 20 }}
    //         onPress={() => {
    //           if (email == "") {
    //             setIsEmpty("Email is required!");
    //           } else {
    //             forgotPassword();
    //           }
    //           navigation.navigate("NewPassword");
    //         }}
    //       >
    //         <View style={{...styles.submit, backgroundColor: state.blueLightTheme.primary}}>
    //           <Text style={styles.submitText}>Submit</Text>
    //         </View>
    //       </TouchableOpacity>
    //     </View>
    //   </Animatable.View>
    // </View>
  );
};

const styles = StyleSheet.create({
  // patentViewStyle: {
  //   flex: 1,
  //   justifyContent: "center",
  //   marginHorizontal: 20,
  // },
  // childViewStyle: {
  //   height: 250,
  //   justifyContent: "space-around",
  //   // alignItems: "center",
  // },

  // // -----------------------
  // container: {
  //   flex: 1,
  //   // backgroundColor: "#E7d08dFF",
  //   // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  // },
  // text_header: {
  //   textAlign: "center",
  //   color: "black",
  //   fontWeight: "bold",
  //   fontSize: 18,
  // },
  // footer: {
  //   flex: 1,
  //   justifyContent: "space-evenly",
  //   backgroundColor: "#fff",
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   paddingHorizontal: 20,
  //   paddingVertical: 50,
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
    //fontWeight: '700'
    fontFamily: "montserrat-medium",
  },
});

export default ForgotPassword;
