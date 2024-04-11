import request from '../components/api';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { GlobalContext } from '../context/Context';
import HeaderComponent from "./Header";
import { Input, Button, Form, Item, Toast, Icon } from 'native-base'
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";



const CreatePipeline = ({ route, navigation }) => {
  const { floorId } = route.params;
  let { state, dispatch } = useContext(GlobalContext);
  const [name, setName] = useState("");
  const [isEmpty, setIsEmpty] = useState("");
  
  // const [floorId, setFloorId] = useState();

  // async function getData(){

  //   const floorIdAsync = await AsyncStorage.getItem("floorId");
  //   if(floorIdAsync != null){
  //     setFloorId(floorIdAsync);
  //   }
  // }



  function create() {
    let obj = {
      floorId: floorId,
      pipeLineName: name
    }
    axios.post(`${state.baseUrl}/pipeline`, obj).then(response => {
      // console.log(response.data);
      dispatch({
        type: "CREATE_PIPELINE",
      })
      Toast.show({
        style: { ...styles.toastStyle },
        text: 'Pipeline Created Successfully!',
        type: 'success'
      })
      navigation.goBack();
    }, (err) => {
      console.log(err);
      Toast.show({
        style: { ...styles.toastStyle },
        text: 'Submission Failed!',
        type: "danger"
      })
    })
  }


  // useEffect(()=> {
  //   getData();
  // }, [])

  return (

    <View style={styles.parentViewStyle}>
      <HeaderComponent
        title="Create Pipeline"
        backIcon="arrow-back"
        backAction={() => navigation.goBack()} />
      <View style={styles.childViewStyle}>
        <Form>
          <Item error={isEmpty != "" ? true : false} style={{ borderBottomWidth: 2 }}>
            <Input
              placeholder="Enter Pipeline Name"
              value={name}
              onChangeText={setName} />
            {isEmpty ? <Icon type="MaterialIcons" name="error" /> : null}
          </Item>
          {isEmpty ? (
            <Text
              style={{
                color: "red",
                alignSelf: "flex-start",
                marginHorizontal: 20,
                marginVertical: 10,
                fontFamily: 'montserrat-regular'
              }}
            >
              {isEmpty}
            </Text>
          ) : null}
          <Button
            onPress={() => {
              if (name == "") {
                setIsEmpty("Name can not be empty!")
              } else {
                create();
              }
            }}
            block
            style={{ ...styles.btnStyle, backgroundColor: state.blueLightTheme.primary }}>
            <Text style={styles.btnTextStyle}>Submit</Text>
          </Button>
        </Form>


      </View>
    </View>

  );
}

const styles = StyleSheet.create({

  parentViewStyle: {
    flex: 1,
    justifyContent: "center",

  },
  childViewStyle: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  toastStyle: {
    borderRadius: 8, margin: 10
  },
  btnStyle: {
    borderRadius: 8, margin: 20
  },
  btnTextStyle: {
    fontSize: 18,
    color: 'white',
    // fontWeight: '700'
    fontFamily: 'montserrat-regular'
  }
})

export default CreatePipeline;