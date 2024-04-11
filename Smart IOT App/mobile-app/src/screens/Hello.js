import React, { useContext } from "react";
import { View, Text } from "react-native";
import { GlobalContext } from "../context/Context";
import { Button, Menu, Provider } from "react-native-paper";
import Icon from "react-native-vector-icons/Entypo";
const Hello = () => {
  const [visible, setVisible] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const openMenu = () => setVisible(!visible);

  const closeMenu = () => setVisible(false);
  
  return (
    <View style={{ flex: 1 }}>
      <Provider>
        <View
          style={{
            // paddingTop: 50,
            // flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            // anchor={<Button onPress={openMenu}>Show menu</Button>}
            anchor={
              <Icon
                name="dots-three-vertical"
                color="black"
                size={25}
                // onPress={() => {
                //   // roomDetails(item._id, index);
                // }}
                onPress={()=> {
                  console.log('button pressed')
                  setVisible(!visible)
                }}
              />
            }
          >
            <Menu.Item onPress={() => {}} title="Edit" />
            <Menu.Item onPress={() => {}} title="Delete" />
          </Menu>
        </View>
      </Provider>
    </View>
  );
};

export default Hello;
