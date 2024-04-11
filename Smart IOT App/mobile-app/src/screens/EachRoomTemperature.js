import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { GlobalContext } from "../context/Context";
import Loader from "../components/loader";
import axios from "axios";
// import { getActiveChildNavigationOptions } from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const EachRoomTemperature = () => {
  let { state } = useContext(GlobalContext);
  const [serverData, setServerData] = useState([]);
  const [roomId, setRoomId] = useState();
  const [loading, setLoading] = useState(false);
  const [currentTemp, setCurrentTemp] = useState();
  const [noDataMessage, setNoDataMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setLoading(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  async function getData() {
    setLoading(true);
    const _roomId = await AsyncStorage.getItem("roomId");
    // console.log("room id in temp from async", _roomId);
    setRoomId(_roomId);
    axios
      .get(`${state.baseUrl}/roomtemperature/?roomId=${_roomId}`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log("Server resposne", res.data);
        setCurrentTemp(Math.round(res.data[res.data.length - 1].temperature));
        res.data = res.data.reverse().slice(0, 5);
        // console.log("res.data", res.data);
        setServerData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setLoading(false);
          setNoDataMessage(error.response.data.noDataMessage);
        }
        setLoading(false);
        console.log("Error in EachRoomTemperature.js", error);
      });
  }

  useEffect(() => {
    getData();
    // roomId ? getData() : null;
  }, []);

  return loading ? (
    <Loader loading={loading} />
  ) : serverData && serverData.length ? (
    <View
      style={{
        flex: 1,
        justifyContent: "space-around",
        backgroundColor: state.blueLightTheme.primary,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "row",
            alignItems: "flex-end",
            marginTop: 20,
            marginBottom: 20,
            // borderWidth: 1, borderColor: 'white'
          }}
        >
          {/* <Image
                    style={{ height: 50, width: 100 }}
                    source={require("../../assets/cloud.png")}
                  /> */}
          <Text
            style={{
              color: "white",
              fontSize: 20,
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 3,
            }}
          >
            Current Temperature
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 30,
              marginLeft: 10,
              marginRight: 10,
            }}
          >{`${currentTemp}°C`}</Text>
          {/* <Text style={{color: 'white', fontSize: 15}}>Current Temperature</Text> */}
        </View>
        <View style={styles.childViewStyle}>
          <Text style={styles.textStyle}>Temperature</Text>
          <LineChart
            data={{
              //  // horizontal
              // labels: ["a", "b", "c", "d", "f"],
              // //  // vertical
              // datasets: [{ data: [20, 30, 30, 20, 30] }],
              labels:
                serverData &&
                serverData?.reverse()?.map((eachTemprature) =>
                  // console.log("testing", eachTemprature)
                  (function dateParser(dateString) {
                    let temp = new Date(dateString);
                    // console.log("temp", temp);
                    let day = temp.getDate() + 1;
                    let month = temp.getMonth() + 1;
                    let year = temp.getFullYear().toString().slice(2, 4);
                    let hours = temp.getHours();
                    let minutes = temp.getMinutes();
                    let seconds = temp.getSeconds();
                    var ampm = hours >= 12 ? "pm" : "am";
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    var strTime = hours + ":" + minutes + " " + ampm;
                    // console.log("strTime", strTime);
                    return strTime;
                  })(eachTemprature.createdOn),
                ),
              datasets: [
                {
                  data: serverData?.reverse()?.map((eachTemprature) =>
                    Math.round(eachTemprature?.temperature),
                  ),
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={240}
            // formatYLabel={(hello) => {
            //   console.log("tempreaterue", hello)
            //   return "hello"
            // }}
            // yAxisLabel="sdfas"
            // withVerticalLabels={false}
            // yAxisLabel=""
            yAxisSuffix=" °C"
            // yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 100, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 100, ${opacity})`,
              style: {
                borderRadius: 5,
                color: "red",
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#fff",
              },
            }}
            bezier
            style={{
              marginVertical: 5,
              borderRadius: 5,
            }}
          />
          {/* <Text style={styles.bottomTextStyle}>Temperature W.R.T Time</Text> */}
        </View>

        {/* Humidity */}
        <View style={styles.childViewStyle}>
          <Text style={styles.textStyle}>Humidity</Text>

          <LineChart
            data={{
              labels: serverData?.reverse()?.map((eachHumidity) => {
                return (function dateParser(dateString) {
                  let temp = new Date(dateString);
                  let day = temp.getDate() + 1;
                  let month = temp.getMonth() + 1;
                  let year = temp.getFullYear().toString().slice(2, 4);
                  let hours = temp.getHours();
                  let minutes = temp.getMinutes();
                  let seconds = temp.getSeconds();
                  var ampm = hours >= 12 ? "pm" : "am";
                  hours = hours % 12;
                  hours = hours ? hours : 12; // the hour '0' should be '12'
                  minutes = minutes < 10 ? "0" + minutes : minutes;
                  var strTime = hours + ":" + minutes + " " + ampm;
                  // console.log("strTime", strTime);
                  return strTime;
                })(eachHumidity?.createdOn);
              }),
              datasets: [
                {
                  data: serverData?.reverse()?.map((eachHumidity) =>
                    Math.ceil(eachHumidity?.humidity),
                  ),
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={240}
            yAxisLabel=""
            yAxisSuffix="C"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "white",
              backgroundGradientFrom: "white",
              backgroundGradientTo: "white",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 100, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 100, ${opacity})`,
              style: {
                borderRadius: 5,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#fff",
              },
            }}
            bezier
            style={{
              marginVertical: 5,
              borderRadius: 5,
            }}
          />
          {/* <Text style={styles.bottomTextStyle}>Humidity W.R.T Time</Text> */}
        </View>
      </ScrollView>
    </View>
  ) : noDataMessage ? (
    // <Text>Sensor not installed</Text>
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 20,
          // fontWeight: "500",
          fontFamily: 'montserrat-regular'
        }}
      >
        Sensor not Installed
      </Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  textStyle: {
    // paddingTop: 10,
    // fontWeight: "bold",
    fontFamily: 'montserrat-semiBold',
    // paddingBottom: 10,
    fontSize: 28,
    alignSelf: "center",
    color: "white",
  },
  bottomTextStyle: {
    alignSelf: "center",
    color: "white",
    fontFamily: 'montserrat-medium'
  },
  childViewStyle: {
    marginVertical: 10,
    // paddingHorizontal: 5
  },
});

export default EachRoomTemperature;
