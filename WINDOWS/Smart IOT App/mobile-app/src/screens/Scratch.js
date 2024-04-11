import React, { useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Platform, StatusBar
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import Icon from "react-native-vector-icons/FontAwesome";
import {GlobalContext} from '../context/Context';

const ScratchScreen = ({ navigation }) => {
      let {state} = useContext(GlobalContext);
  const [showRealApp, setShowRealApp] = useState(false);

  const onDone = () => {
    setShowRealApp(true);
  };
  const onSkip = () => {
    setShowRealApp(true);
  };
  const RenderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingBottom: 50,
        }}
      >
        {/* <Text style={styles.introTitleStyle}>{item.title}</Text> */}
        <View style={{ width: 500, height: 500 }}>
          <Image style={styles.introImageStyle} source={item.image} />
        </View>

        <Text style={styles.introTextStyle}>{item.text}</Text>
      </View>
    );
  };

  const slides = [
    {
      key: "s1",
      text: "Our Login Screen",
      title: "Login",
      image: require("../../assets/pic1.jpeg"),
      backgroundColor: "#E7d08dFF",
    },
    {
      key: "s2",
      title: "Flight Booking",
      text: "Here you will create your Home",
      image: require("../../assets/pic2.jpeg"),
      backgroundColor: "#E7d08dFF",
    },
    {
      key: "s3",
      title: "Great Offers",
      text: "Here you will create floor",
      image: require("../../assets/pic3.jpeg"),
      backgroundColor: "#E7d08dFF",
    },
  ];
  return (
    <>
      {showRealApp ? (
        <View style={styles.ViewStyle}>
          <View style={styles.contentView}>
            {/* <View style={{ flex: 2 }}> */}
            <View style={{ width: 420, height: 470 }}>
              <Image
                source={require("../../assets/alexa.gif")}
                style={{
                  flex: 1,
                  width: undefined,
                  height: undefined,
                  resizeMode: "contain",
                  //   backgroundColor: "red",
                }}
              />
            </View>

            <View style={styles.textView}>
              <Text style={styles.textStyle}>Welcome To Smart Home</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <View style={{...styles.getStarted, backgroundColor: state.blueLightTheme.primary}}>
                  <Text style={styles.textSign}>Get Started</Text>
                  <Icon name="arrow-right" color="#fff" size={17} />
                </View>
              </TouchableOpacity>
              <Text style={styles.textStyle}>About Us</Text>
            </View>
          </View>
        </View>
      ) : (
        <AppIntroSlider
          data={slides}
          renderItem={RenderItem}
          onDone={onDone}
          showSkipButton={true}
          onSkip={onSkip}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  ViewStyle: {
    flex: 1,
    // backgroundColor: "#E7d08dFF",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  getStarted: {
    width: 200,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
    // backgroundColor: state.blueLightTheme.primary,
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: "5%",
  },
  contentView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textView: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  textStyle: {
    fontSize: 24,
    // fontWeight: "bold",
    fontFamily: "serif",
  },
  introTitleStyle: {
    fontSize: 18,
    // fontWeight: "bold",
    // fontFamily: "serif",
    color: "red",
  },
  introImageStyle: {
    // resizeMode: "contain",
    // height: 550,
    // width: 550,
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: "contain",
  },
  introTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ScratchScreen;
