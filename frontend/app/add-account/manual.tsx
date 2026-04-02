import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/api";
import AuthInput from "@/components/AuthInput";

export default function ManualEntryScreen() {
  const [serviceName, setServiceName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!serviceName || !secretKey) {
      Alert.alert("Error", "Service name and secret key are required");
      return;
    }
    const cleanKey = secretKey.replace(/\s/g, "").toUpperCase();
    if (cleanKey.length < 16) {
      Alert.alert("Error", "Secret key must be at least 16 characters");
      return;
    }
    setLoading(true);
    try {
      const uid = await AsyncStorage.getItem("uid");
      if (!uid) {
        router.replace("/(auth)/login" as any);
        return;
      }
      await axios.post(`${API_BASE_URL}/accounts/add`, {
        uid,
        serviceName,
        accountEmail,
        secretKey: cleanKey,
      });
      Alert.alert("Success", `${serviceName} added to your vault!`, [
        { text: "OK", onPress: () => router.replace("/(tabs)/vault" as any) },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Failed to save account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f6fa" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Ionicons name="shield-checkmark" size={18} color="#2563eb" />
            <Text style={styles.brandName}>SafeAuth</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Add Account</Text>
          <Text style={styles.subheading}>Enter your security credentials manually</Text>

          <AuthInput
            label="Service Name"
            iconName="grid-outline"
            placeholder="e.g. Google, Github, Amazon"
            value={serviceName}
            onChangeText={setServiceName}
            autoCapitalize="words"
          />
          <AuthInput
            label="Account / Email"
            iconName="mail-outline"
            placeholder="username@example.com"
            keyboardType="email-address"
            value={accountEmail}
            onChangeText={setAccountEmail}
          />
          <AuthInput
            label="Secret Key"
            iconName="eye-off-outline"
            placeholder="Enter the Base32 secret"
            value={secretKey}
            onChangeText={setSecretKey}
            autoCapitalize="characters"
            isPassword
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              Secret keys are provided by the service during 2FA setup. They are stored securely in your vault.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonInner}>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Save Account</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 56,
    backgroundColor: "#f5f6fa",
  },
  topBar: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandName: { fontSize: 15, fontWeight: "800", color: "#2563eb" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  heading: { fontSize: 22, fontWeight: "800", color: "#111827", marginBottom: 4 },
  subheading: { fontSize: 13, color: "#9ca3af", marginBottom: 24 },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 12, color: "#6b7280", lineHeight: 18 },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  cancelBtn: { alignItems: "center", marginTop: 16 },
  cancelText: { color: "#9ca3af", fontSize: 12, fontWeight: "700", letterSpacing: 1 },
});