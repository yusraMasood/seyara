import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { vh, vw } from "../../utils/dimensions";

type ButtonProps = {
  label: string;
  onPress: () => void;
};

export const BUTTON: React.FC<ButtonProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Text style={styles.btnText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: vh * 1.5,
    paddingHorizontal: vw * 4,
  },
  btnText: { color: "white", fontWeight: "600" },
});
