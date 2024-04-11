import React from "react";
import Modal from "react-native-modal";
import { View } from "react-native";
import { Text } from "react-native";
const ModalComponent = ({ children, isModalVisible }) => {
  return (
    <Modal isVisible={isModalVisible} animationIn={"slideInUp"}>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: "#f4f4f4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        {children}
      </View>
    </Modal>
  );
};

export default ModalComponent;
