import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import { Avatar, Divider } from "react-native-paper";
import { Icon } from "react-native-elements";
import { Button } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "../context/Context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Input, Form, Item, Spinner, Toast } from "native-base";
import axios from "axios";

const Sidebar = ({ navigation, closeDrawer, floorName }) => {
  // console.log("navigation", navigation);
  let { state } = useContext(GlobalContext);
  const [home, setHome] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [spinner, setSpinner] = useState(false);

  // console.log(homeName);
  async function getData() {
    try {
      const home_name = await AsyncStorage.getItem("homeName");
      const user_name = await AsyncStorage.getItem("user");
      const user_email = await AsyncStorage.getItem("email");
      // console.log("Local Storage Data : ", home, user, email);
      setHome(home_name);
      setUser(user_name);
      setEmail(user_email);
    } catch (error) {
      // Error retrieving data
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function logout() {
    setSpinner(true);
    axios
      .post(`${state.baseUrl}/auth/logout`)
      .then((response) => {
        setSpinner(false);
        if (response.status === 200) {
          navigation.navigate("AuthStack", { screen: "Login" });
        }
      })
      .catch((err) => {
        setSpinner(false);
        console.log(err);
      });
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        marginTop: 20
        // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      {/* <Button style={{alignSelf: 'flex-end'}} icon="close-thick"></Button> */}

      <Button
        transparent
        style={{ alignSelf: "flex-end", marginRight: 20 }}
        onPress={closeDrawer}
      >
        <Icon name="close" />
      </Button>
      <View style={{ alignItems: "center", marginVertical: 30 }}>
        <Avatar.Image
          size={100}
          source={require("../../assets/userImage.png")}
        />
        <Text style={{ fontSize: 22, fontFamily: 'montserrat-medium', marginVertical: 10 }}>
          {user}
        </Text>
        <Text>{email}</Text>
      </View>
      <Divider />
      <View style={{ marginHorizontal: 10 }}>
        {/* home name */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Icon
            style={{
              fontSize: 50,
              marginVertical: 10,
              marginRight: 20,
              color: state.blueLightTheme.primary,
            }}
            type="FontAwesome"
            name="home"
          />
          <Text style={styles.textStyle}>{home}</Text>
        </View>

        <Divider />

        {/* floor name */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Icon
            style={{
              fontSize: 20,
              marginVertical: 10,
              marginRight: 20,
              color: state.blueLightTheme.primary,
            }}
            type="MaterialIcons"
            name="apartment"
          />
          <Text style={styles.textStyle}>{floorName}</Text>
        </View>

        <Divider />

        <View
          style={{
            marginTop: 19,
          }}
        >
          <Button
            onPress={logout}
            block
            style={{
              ...styles.btnLogoutStyle,
              backgroundColor: state.blueLightTheme.primary,
            }}
          >
            {spinner ? (
              <Spinner color="white" />
            ) : (
              <Text
                style={{
                  ...styles.btnLogoutTextStyle,
                  color: "white",
                }}
              >
                Logout
              </Text>
            )}
          </Button>
        </View>

        <Divider />
      </View>

      {/* <Button onPress={() => navigation.closeDrawer()} title="Close Drawer" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    display: "flex",
    fontSize: 16,
    marginVertical: 10,
    fontFamily: 'montserrat-regular'
  },
  btnLogoutStyle: {
    borderWidth: 3,
    borderRadius: 8,
    height: 40,
    marginHorizontal: 10,
  },
  btnLogoutTextStyle: {
    fontSize: 18,
    // fontWeight: "700",
    fontFamily: 'montserrat-medium'
  },
});

export default Sidebar;
