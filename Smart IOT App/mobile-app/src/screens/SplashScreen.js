import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, Image, StatusBar, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {GlobalContext} from '../context/Context';
const Splash = ({ navigation }) => {
      let {state} = useContext(GlobalContext);

  const getData = async () => {
    try {
      const is_user_exist = await AsyncStorage.getItem('is_user_exist');
      const id = await AsyncStorage.getItem('id');
      setTimeout(()=> {
        console.log('user exist: ',is_user_exist);
        console.log('user email: ',id);
        // if(is_user_exist == null){
        //   navigation.reset({
        //     routes: [{ name: 'Scratch'}],
        //   });
        // }else {
          if(id == null){
            navigation.navigate('AuthStack')
            // navigation.reset({
            //   routes: [{ name: 'Login'}],
            // });
          }else {
            navigation.navigate('TabStack')
            // navigation.reset({
            //   routes: [{ name: 'HomeList', params: {id: id} }],
            // });
          }
        // }
            // navigation.navigate('AuthStack')
            // navigation.reset({
            //   routes: [{ name: 'AuthStack' }]
            // })

      }, 3000)
    } catch(e) {
     console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: "#E7d08dFF",
        justifyContent: "center",
        alignItems: "center",
        // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      <Image
        style={{ height: 220, width: 180 }}
        source={require("../../assets/smartHome-logo.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Splash;
