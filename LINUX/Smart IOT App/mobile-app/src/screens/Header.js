import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Header, Left, Body, Button, Icon, Title, Right } from 'native-base';
import { GlobalContext } from "../context/Context";


const HeaderComponent = ({ title, backIcon="", backAction, addAction, addIcon="" }) => {
    let { state } = useContext(GlobalContext);
    return <View style={{ 
        marginTop: 20,
        backgroundColor: '#043A75', 
        flexDirection: 'row', 
        height: 50, 
        justifyContent: 'space-between', alignItems: 'center' }}>
        {/* <Left> */}
            <Button transparent onPress={backAction ? backAction : ()=>console.log('helo back action')} >
                <Icon name={backIcon} style={{color: 'white'}} />
            </Button>
        {/* </Left> */}
        {/* <Body> */}
            <Title style={{fontFamily: "montserrat-medium"}}>{title}</Title>
        {/* </Body> */}
        {/* <Right> */}
            <Button transparent onPress={addAction ? addAction : ()=> console.log('hello add action')} >
                <Icon name={addIcon} type="Entypo" style={{color: 'white'}} />
            </Button>
        {/* </Right> */}
    </View>
}

export default HeaderComponent;