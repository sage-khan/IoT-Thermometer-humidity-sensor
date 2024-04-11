import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GlobalContext } from "../context/Context";
import { Spinner, Fade } from "native-base";
import * as Animatable from "react-native-animatable";

const EachRoomLights = ({ roomId }) => {
  const { state } = useContext(GlobalContext);
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const handlePress = (message) => {
    setLoading(true);
    axios
      .put(`${state.baseUrl}/roomlight`, {
        roomId: "610e6abc662cec3b607c4096",
        message,
      })
      .then((response) => {
        setLoading(false);
        setOn(true);
        setOn(response?.data.includes("on") ? true : false);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setOn(true);
        }
        setLoading(false);
        console.log("Server ERROR", err);
      });
  };

  useEffect(() => {
    axios
      .get(`${state.baseUrl}/lightstatus?roomId=610e6abc662cec3b607c4096`)

      .then((response) => {
        setLoading(false);
        setOn(response.data);
      })
      .catch((error) => {
        setLoading(false);
        // setOn(true);
        console.log("Server ERROR", error);
      });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        //  marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      {on ? (
        // light on screen
        <Animatable.View animation="zoomIn" style={styles.loginFormStyle}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000746",
            }}
          >
            <View
              style={{
                height: 600,
                width: 600,
                borderRadius: 300,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000A76",
              }}
            >
              <View
                style={{
                  height: 500,
                  width: 500,
                  borderRadius: 250,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000F96",
                }}
              >
                <View
                  style={{
                    height: 400,
                    width: 400,
                    borderRadius: 200,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#0023D1",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 300,
                      width: 300,
                      borderRadius: 150,
                      backgroundColor: "#0234E8",
                    }}
                  >
                    <View
                      style={{
                        height: 200,
                        width: 200,
                        borderRadius: 100,
                        backgroundColor: "#0148F7",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          width: 100,
                          height: 100,
                          borderRadius: 100 / 2,
                          borderStyle: "dashed",
                          backgroundColor: "#0187F7",
                        }}
                      >
                        {loading ? (
                          <Spinner color="white" />
                        ) : (
                          <Pressable onPress={() => handlePress("off")}>
                            <Icon name="power" size={80} color="yellow" />
                          </Pressable>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animatable.View>
      ) : (
        // light off screen
        <View
          style={{
            flex: 1,
            backgroundColor: "#000746",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "blue",
              // borderColor: "red",
              position: "absolute",
              bottom: 50,
            }}
          >
            {loading ? (
              <Spinner color="white" />
            ) : (
              <Pressable onPress={() => handlePress("on")}>
                <Icon name="power" size={80} color={on ? "yellow" : "white"} />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loginFormStyle: {
    flex: 1,
    marginTop: -35,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 15,
  },
});

export default EachRoomLights;
