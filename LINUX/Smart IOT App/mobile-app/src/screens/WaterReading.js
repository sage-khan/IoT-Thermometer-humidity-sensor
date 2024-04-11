import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { GlobalContext } from "../context/Context";
const screenWidth = Dimensions.get("window").width;
import HeaderComponent from "./Header";

const WaterReading = ({ navigation }) => {
  let { state } = useContext(GlobalContext);
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const chartConfig = {
    // backgroundColor: "#EFDEAD",
    // backgroundGradientFrom: "#EFDEAD",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: state.blueLightTheme.primary,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  return (
    <View
      style={{
        flex: 1,
        //  marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        justifyContent: "space-around",
      }}
    >
      <HeaderComponent
        title="Water Readings"
        iconName="arrow-back"
        action={() => navigation.goBack()}
      />
      <View style={{ margin: 5 }}>
        <Text style={{ fontSize: 22, fontFamily: 'montserrat-medium' }}>
          Hot Water Reading
        </Text>
        <BarChart
          // style={graphStyle}
          data={data}
          width={screenWidth}
          height={230}
          // yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>
      <View style={{ margin: 5 }}>
        <Text style={{ fontSize: 22, fontFamily: 'montserrat-medium' }}>
          Cold Water Reading
        </Text>
        <BarChart
          // style={graphStyle}
          data={data}
          width={screenWidth}
          height={250}
          // yAxisLabel="$"
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default WaterReading;
