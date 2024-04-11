import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from "react-native";

const CoffeeScreen = () => {
  return (
    <View style={styles.mainViewStyle}>
      <Text
        style={{
          fontSize: 30,
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 30,
        }}
      >
        Coffee
      </Text>

      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 24 }}>Say, Make me a coffee..</Text>
        <Image
          style={styles.imageStyle}
          source={require("../../assets/mic.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    justifyContent: "space-around",
    flex: 1,
    // backgroundColor: '#EFDEAD',
    // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  imageStyle: {
    height: 250,
    width: 200,
    // marginTop: 20
  },
});

export default CoffeeScreen;
