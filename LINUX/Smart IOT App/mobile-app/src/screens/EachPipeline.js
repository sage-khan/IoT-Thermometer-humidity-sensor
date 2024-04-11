import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { GlobalContext } from "../context/Context";
import { BarChart } from "react-native-chart-kit";
import { VictoryTheme } from "victory-native";
import { VictoryBar, VictoryChart } from "victory-native";
import DateRangePicker from "react-native-daterange-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HeaderComponent from "./Header";
import Loader from "../components/loader";
import axios from "axios";

const EachPipeline = ({ floorId, pipelineId, navigation }) => {
  let { state } = useContext(GlobalContext);
  const screenWidth = Dimensions.get("window").width;
  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    axios
      .get(
        `${state.baseUrl}/pipelinereadings?pipeLineId=61183d82d51bde2c6f5094b9&floorId=610e6a91662cec3b607c4095`,
      )
      .then((response) => {
        response.data = response.data.slice(0, 5).reverse();
        // response.data = response.data.reverse().slice(0, 5);
        setServerData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
      });
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${state.baseUrl}/pipelinereadings?pipeLineId=61183d82d51bde2c6f5094b9&floorId=610e6a91662cec3b607c4095`,
      )
      .then((response) => {
        response.data = response.data.slice(0, 5).reverse();
        // response.data = response.data.reverse().slice(0, 5);
        setServerData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent
        title="Pipeline Readings"
        backIcon="arrow-back"
        backAction={() => navigation.goBack()}
      />
      {loading ? (
        <Loader loading={loading} />
      ) : serverData && serverData.length ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'white',
          }}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, alignItems: "center" }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.container}>
              <BarChart
                data={{
                  labels: serverData?.map((eachReading) => {
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
                      return strTime;
                    })(eachReading?.createdOn);
                  }),
                  datasets: [
                    {
                      data: serverData?.map((eachReading) =>
                        Math.ceil(eachReading?.pipeLineReading),
                      ),
                    },
                  ],
                }}
                width={screenWidth}
                height={250}
                showValuesOnTopOfBars={true}
                withCustomBarColorFromData={true}
                flatColor={true}
                yAxisLabel=""
                yAxisSuffix="ml"
                chartConfig={{
                  backgroundGradientFrom: state.blueLightTheme.gray,
                  backgroundGradientTo: state.blueLightTheme.gray,
                  strokeWidth: 6, // optional, default 3
                  barPercentage: 1,
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(0, 0, 100, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 100, ${opacity})`,
                  fillShadowGradient: "#FF493B", // THIS
                  fillShadowGradientOpacity: 0.1, // THIS
                }}
                style={{
                  marginVertical: 5,
                  borderRadius: 5,
                }}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 20,
              //fontWeight: "500",
              fontFamily: 'montserrat-medium'
            }}
          >
            Sensor not Installed
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderColor: 'red',
    // borderWidth: 5,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
    // backgroundColor: "#f5fcff"
  },
});
export default EachPipeline;

{
  /* <View>
        <DateRangePicker
          onChange={changeDate}
          endDate={endDate}
          startDate={startDate}
          // displayedDate={moment(displayedDate)}
          range
        >
          <Text>Click me!</Text>
        </DateRangePicker>
      </View> */
}

{
  /* ---------------- */
}

{
  /* <Button title="Show Date Picker" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        /> */
}

// const showDatePicker = () => {
//   setDatePickerVisibility(true);
// };

// const hideDatePicker = () => {
//   setDatePickerVisibility(false);
// };

// const handleConfirm = (date) => {
//   console.warn("A date has been picked: ", date);
//   hideDatePicker();
// };
