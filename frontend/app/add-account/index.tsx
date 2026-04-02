import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@/constants/api";

export default function AddAccountScreen() {
  const [scanning, setScanning] = useState(false);

  const handleGalleryUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }

  const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
  base64: true,
});

    if (result.canceled || !result.assets[0]) return;

    setScanning(true);
    try {
      const base64 = result.assets[0].base64;
      const res = await axios.post(`${API_BASE_URL}/accounts/scan-qr`, {
        imageBase64: base64,
      });

      const data = res.data as {
        serviceName: string;
        accountEmail: string;
        secretKey: string;
      };

      const uid = await AsyncStorage.getItem("uid");
      if (!uid) {
        router.replace("/(auth)/login" as any);
        return;
      }

      await axios.post(`${API_BASE_URL}/accounts/add`, {
        uid,
        serviceName: data.serviceName,
        accountEmail: data.accountEmail,
        secretKey: data.secretKey,
      });

      Alert.alert("Success", `${data.serviceName} added to your vault!`, [
        { text: "OK", onPress: () => router.replace("/(tabs)/vault" as any) },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Could not read QR code. Try manual entry.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Add Account</Text>
            <Text style={styles.sub}>Choose how you want to add your new token</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.option} onPress={handleGalleryUpload} disabled={scanning}>
          <View style={[styles.optionIcon, { backgroundColor: "#eff6ff" }]}>
            {scanning ? (
              <ActivityIndicator size="small" color="#2563eb" />
            ) : (
              <Ionicons name="image-outline" size={22} color="#2563eb" />
            )}
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Upload from Gallery</Text>
            <Text style={styles.optionSub}>Import a QR code from your photo library</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/add-account/manual" as any)}
        >
          <View style={[styles.optionIcon, { backgroundColor: "#f0fdf4" }]}>
            <Ionicons name="keypad-outline" size={22} color="#059669" />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Enter Manually</Text>
            <Text style={styles.optionSub}>Type in the secret key provided by the service</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 4 },
  sub: { fontSize: 13, color: "#9ca3af" },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  optionIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  optionSub: { fontSize: 12, color: "#9ca3af", marginTop: 3 },
  cancelBtn: {
    marginTop: 4,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: "#6b7280" },
});