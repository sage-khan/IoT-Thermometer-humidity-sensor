import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
// import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const CardScreen = ({title}) => {
    return <View style={styles.viewStyle}>
        <Text style={{fontSize: 20}}>{title}</Text>
    </View>
}

const styles = StyleSheet.create({
    viewStyle: {
        height: 60,
        // alignSelf: 'stretch',
        marginLeft: 20,
        marginRight: 20,
        // marginTop: 5,
        // marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFDEAD',
        elevation: 10,
        borderRadius: 5

    }
})

export default CardScreen;