import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;


const ChartScreen = ({title, values}) => {
    return <View style={{alignItems: 'center', marginVertical: 30}}>
        <Text style={{fontSize: 28}}>{title}</Text>

        <LineChart
            data={{
            labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
            datasets: [
                {
                    data: [34, 23, 33, 35, 27, 29, 31, 36]
                }
            ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={250}
            yAxisLabel=""
            yAxisSuffix="C"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
            backgroundColor: "#EFDEAD",
            // backgroundGradientFrom: "#EFDEAD",
            backgroundGradientTo: "#EFDEAD",
            // decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                // alignSelf: 'stretch',
                borderRadius: 15
            },
            propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
            }
            }}
            bezier
            style={{
            marginVertical: 8,
            // marginHorizontal: 10,
            borderRadius: 5
            }}
        />
    </View>
}

const styles = StyleSheet.create({

})

export default ChartScreen;