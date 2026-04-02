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
  Clipboard,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/api";
import AuthInput from "@/components/AuthInput";

export default function EditAccountScreen() {
  const {
    id,
    serviceName: initialName,
    accountEmail: initialEmail,
    secretKey: initialKey,
  } = useLocalSearchParams<{
    id: string;
    serviceName: string;
    accountEmail: string;
    secretKey: string;
  }>();

  const [serviceName, setServiceName] = useState(initialName || "");
  const [accountEmail, setAccountEmail] = useState(initialEmail || "");
  const [secretKey] = useState(initialKey || "");
  const [loading, setLoading] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);

  const handleCopyKey = () => {
    Clipboard.setString(secretKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!serviceName) {
      Alert.alert("Error", "Service name is required");
      return;
    }
    setLoading(true);
    try {
      const uid = await AsyncStorage.getItem("uid");
      if (!uid) {
        router.replace("/(auth)/login" as any);
        return;
      }
      await axios.put(`${API_BASE_URL}/accounts/${uid}/${id}`, {
        serviceName,
        accountEmail,
      });
      Alert.alert("Success", "Account updated successfully!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/vault" as any) },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Failed to update account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f6fa" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <Ionicons name="shield-checkmark" size={18} color="#2563eb" />
          <Text style={styles.brandName}>SafeAuth</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Edit Account</Text>
          <Text style={styles.subheading}>Fill in your account details</Text>

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

          <View style={styles.secretKeyBox}>
            <View style={styles.secretHeader}>
              <Text style={styles.secretLabel}>SECRET KEY</Text>
              <TouchableOpacity style={styles.copyKeyBtn} onPress={handleCopyKey}>
                <Ionicons
                  name={keyCopied ? "checkmark" : "copy-outline"}
                  size={14}
                  color={keyCopied ? "#059669" : "#2563eb"}
                />
                <Text style={[styles.copyKeyText, keyCopied && { color: "#059669" }]}>
                  {keyCopied ? "Copied!" : "Copy"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.secretValueRow}>
              <Ionicons name="key-outline" size={16} color="#9ca3af" style={{ marginTop: 2 }} />
              <Text style={styles.secretValue} selectable>
                {secretKey}
              </Text>
            </View>

            <View style={styles.secretNoteRow}>
              <Ionicons name="information-circle-outline" size={13} color="#9ca3af" />
              <Text style={styles.secretNote}>
                Secret key cannot be changed for security reasons.
              </Text>
            </View>
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
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: "#f5f6fa",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandName: { fontSize: 15, fontWeight: "800", color: "#2563eb" },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 24,
  },
  secretKeyBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secretHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  secretLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 0.8,
  },
  copyKeyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  copyKeyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563eb",
  },
  secretValueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  secretValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    letterSpacing: 1.5,
    lineHeight: 20,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  secretNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secretNote: {
    fontSize: 11,
    color: "#9ca3af",
    flex: 1,
    lineHeight: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  cancelBtn: {
    alignItems: "center",
    marginTop: 12,
    padding: 14,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
  },
  cancelText: { fontSize: 14, fontWeight: "700", color: "#6b7280" },
});