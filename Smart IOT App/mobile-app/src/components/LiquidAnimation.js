import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Button,
  StatusBar,
  Animated,
  TouchableOpacity,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import MaskedView from "@react-native-community/masked-view";
export default function LiquidAnimation({ reading, isCritical }) {
  reading === 9 ? (reading = 200) : reading < 0 ? (reading = 0) : reading;
  // console.log("reading", reading);
  // const windowHeight = Dimensions.get("window");
  const SIZE = 500;
  const backgroundColor = "#173348";
  const frontWaveColor = reading <= 20 ? "#F44336" : "#00BBFB";
  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  const progress = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(1)).current;
  const width = Dimensions.get("window").width;

  const px = (number) => {
    return width < 392.72727272727275
      ? (number * 350) / width
      : (number * 392.72727272727275) / width;
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 2,
        duration: 5500,
        useNativeDriver: true,
      }),
      {
        resetBeforeIteration: true,
      },
    ).start();
  }, []);

  useEffect(() => {
    Animated.spring(fillAnim, {
      // toValue: fill,
      toValue: reading,
      useNativeDriver: true,
      tension: 20,
    }).start();
    // }, [fill]);
  }, [reading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#173348",
      }}
    >
      {isCritical && reading != 0 ? (
        <View
          style={{
            color: "#fff",
            textAlign: "center",
            position: "absolute",
            top: "6%",
            zIndex: 999,
          }}
        >
          <Text
            style={{
              fontSize: 23,
              color: "#fff",
            }}
          >
            Water Tank is going to Overflow
          </Text>
        </View>
      ) : null}

      <View
        style={{
          color: "#fff",
          textAlign: "center",
          position: "absolute",
          top: "50%",
          zIndex: 999,
        }}
      >
        <Text
          style={{
            fontSize: 70,
            color: "#fff",
          }}
        >
          {/* {(reading * 100).toFixed(0)}% */}
          {(reading / 2).toFixed(0)}%
        </Text>
      </View>

      <Animated.View
        style={{
          opacity: reading == 0 ? 0 : 1,
          transform: [
            {
              translateY: fillAnim.interpolate({
                inputRange: [0, 210],
                outputRange: [px(120), px(-155)],
              }),
            },
          ],
        }}
      >
        <AnimatedSvg
          width={px(SIZE * 3)}
          height={px(SIZE)}
          style={{
            left: (px(-100) * SIZE) / 280,

            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, (px(280) * SIZE) / 280, 0],
                  extrapolate: "clamp",
                }),
              },
              { scale: 0.8 },
              { translateY: px(7) },
            ],
          }}
          viewBox={`0 0 560 20`}
        >
          <Path
            d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"
            fill={"#0080B7"}
          ></Path>
          <Path
            d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"
            fill={"#0080B7"}
          ></Path>
          <Path
            d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"
            fill={"#0080B7"}
          ></Path>
          <Path
            d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"
            fill={"#0080B7"}
          ></Path>
        </AnimatedSvg>
        <AnimatedSvg
          width={px(SIZE * 3)}
          height={px(SIZE)}
          style={{
            left: (px(300) * SIZE) / 280,
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, (px(-600) * SIZE) / 280, px(0)],
                  extrapolate: "clamp",
                }),
              },
              { scale: 1.2 },
            ],
            backgroundColor: "transparent",
            position: "absolute",
          }}
          viewBox={`0 0 560 20`}
        >
          <Path
            d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"
            fill={frontWaveColor}
          ></Path>
          <Path
            d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"
            fill={frontWaveColor}
          ></Path>
          <Path
            d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"
            fill={frontWaveColor}
          ></Path>
          <Path
            d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"
            fill={frontWaveColor}
          ></Path>
        </AnimatedSvg>
        <AnimatedSvg
          width={px(SIZE * 3)}
          height={px(SIZE * 2)}
          style={{
            transform: [{ translateY: (SIZE / 280) * px(-110) }, { scale: 1 }],
            backgroundColor: "transparent",
            position: "absolute",
          }}
          viewBox={`0 0 560 20`}
        >
          <Rect width={`180%`} height={`190%`} fill={frontWaveColor} />
        </AnimatedSvg>
      </Animated.View>
    </View>
  );
}
