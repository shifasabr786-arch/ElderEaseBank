import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function AccessibleButton({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
});
