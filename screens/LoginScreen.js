import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { login } = useAuth();

  const handleAuth = async () => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable) {
      Alert.alert("Error", "Biometric authentication not supported on this device.");
      return;
    }

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      Alert.alert("Error", "No biometric records found. Please set up Face ID / Fingerprint.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to continue",
      fallbackLabel: "Enter password",
    });

    if (result.success) {
      login();
    } else {
      Alert.alert("Authentication failed", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please authenticate to continue</Text>
      <TouchableOpacity onPress={handleAuth} style={styles.button}>
        <Text style={styles.buttonText}>LOGIN WITH FINGERPRINT / FACE ID</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
