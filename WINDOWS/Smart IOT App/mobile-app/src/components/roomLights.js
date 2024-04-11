import React, {useState} from 'react';
import { Text, View, StyleSheet, Image, Switch, Alert} from 'react-native';

const RoomLightsComponent = ({title, src}) => {

    const [isEnabled, setIsEnabled] = useState(false)

    const alertMessage = () =>{
        Alert.alert(
            isEnabled ? "Lights OFF" : "lights ON",
            isEnabled ? `${title} lights turned OFF` : `${title} Lights turned ON`,
            [
                {
                    cancelable: true,
                    text: "OK",
                    onPress: ()=> {
                        console.log('OK pressed')
                    },
                    
                }
            ]
        )
    }

    return <View style={styles.childViewStyle}>
            <View>
                <Image style={styles.imageStyle} source={src} />
                <Text style={styles.roomTitle}>{title}</Text>
            </View>
            {/* <Switch
                trackColor={{ false: "#767577", true: state.blueLightTheme.primary }}
                // thumbColor={isEnabled ? "#000000" : "#ffffff"}
                thumbColor={{false: "#ffffff", true: "#A78C43"}}

                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onValueChange={ () => {
                    alertMessage();

                    isEnabled ? setIsEnabled(false) : setIsEnabled(true);
                    // alert("lights status changed")
                    // Alert.alert(
                    //     "Lights status changed",
                    //     [
                    //         {
                    //             text: "OK",
                    //             onPress: ()=> console.log("ok pressed")
                    //         }
                    //     ]
                    // )
                }}
            /> */}

        </View>
}

const styles = StyleSheet.create({

    childViewStyle:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'space-around',
        // borderWidth: 1,
        // borderColor: 'black'
    },
    roomTitle: {
        color: 'white', 
        fontWeight: '500',
        fontSize: 18, 
        position: 'absolute',
        bottom: 6, 
        marginLeft: 5
    },
    imageStyle: {
        height: 115,
        width: 170,
        borderRadius: 5,
        marginRight: 5
    },

    
    
})

export default RoomLightsComponent;