import { API_BASE_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function AddAccountScreen() {
  const [scanning, setScanning] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanned, setScanned] = useState(false);
 const [permission, requestPermission] = useCameraPermissions();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToast(null));
  };

  const handleCameraScan = async () => {
if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        showToast("Please allow camera access.", "error");
        return;
      }
    }
    setScanned(false);
    setCameraOpen(true);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setCameraOpen(false);
    setScanning(true);
    try {
      const url = new URL(data);
      const secret = url.searchParams.get("secret") || "";
    const label = decodeURIComponent(url.pathname.replace(/^\/totp\//, ""));
      const issuerParam = url.searchParams.get("issuer");
      const [rawIssuer, rawEmail] = label.includes(":") ? label.split(":") : [label, label];
      const issuer = issuerParam || rawIssuer;
      const email = rawEmail;

      const uid = await AsyncStorage.getItem("uid");
      if (!uid) { router.replace("/(auth)/login" as any); return; }

      await axios.post(`${API_BASE_URL}/accounts/add`, {
        uid,
        serviceName: issuer.trim(),
        accountEmail: email.trim(),
        secretKey: secret,
      });

await AsyncStorage.removeItem("vault_accounts_cache");
      showToast(`${issuer.trim()} added to your vault!`, "success");
      setTimeout(() => router.replace("/(tabs)/vault" as any), 1500);
    } catch {
      showToast("Invalid QR code. Try manual entry.", "error");
    } finally {
      setScanning(false);
    }
  };

  const handleGalleryUpload = async () => {
    setGalleryLoading(true);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (!permission.granted) {
      showToast("Please allow access to your photo library.", "error");
      setGalleryLoading(false);
      return;
    }

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
  base64: true,
});

    if (result.canceled || !result.assets[0]) return;

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

await AsyncStorage.removeItem("vault_accounts_cache");
      showToast(`${data.serviceName} added to your vault!`, "success");
      setTimeout(() => router.replace("/(tabs)/vault" as any), 1500);
    } catch (err: any) {
      showToast(err.response?.data?.error || "Could not read QR code. Try manual entry.", "error");
    } finally {
      setGalleryLoading(false);
    }
  };

if (cameraOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraFrame} />
          <Text style={styles.cameraHint}>Align QR code within the frame</Text>
        </View>
        <TouchableOpacity style={styles.cameraClose} onPress={() => setCameraOpen(false)}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

return (
    <View style={{ flex: 1 }}>
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Add Account</Text>
            <Text style={styles.sub}>
              Choose how you want to add your new token
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
<TouchableOpacity
          style={styles.option}
          onPress={handleCameraScan}
          disabled={scanning}
        >
          <View style={[styles.optionIcon, { backgroundColor: "#fff7ed" }]}>
            <Ionicons name="qr-code-outline" size={22} color="#ea580c" />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Scan QR Code</Text>
            <Text style={styles.optionSub}>
              Use your camera to scan a QR code
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
        </TouchableOpacity>

<TouchableOpacity
          style={styles.option}
          onPress={handleGalleryUpload}
          disabled={galleryLoading}
        >
        <View style={[styles.optionIcon, { backgroundColor: "#eff6ff" }]}>
            {galleryLoading ? (
              <ActivityIndicator size="small" color="#0e1f42" />
            ) : (
              <Ionicons name="image-outline" size={22} color="#0e1f42" />
            )}
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Upload from Gallery</Text>
            <Text style={styles.optionSub}>
              Import a QR code from your photo library
            </Text>
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
            <Text style={styles.optionSub}>
              Type in the secret key provided by the service
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
        </TouchableOpacity>

<TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
    {toast && (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          toast.type === "success" ? styles.toastSuccess : styles.toastError,
          {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          },
        ]}
      >
        <Ionicons name={toast.type === "success" ? "checkmark-circle" : "close-circle"} size={16} color="#fff" />
        <Text style={styles.toastText}>{toast.message}</Text>
      </Animated.View>
    )}
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
  toast: {
    position: "absolute",
    bottom: 16,
    left: 24,
    right: 24,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toastSuccess: { backgroundColor: "#059669" },
  toastError: { backgroundColor: "#ef4444" },
  toastText: { color: "#fff", fontSize: 13, fontWeight: "600", flex: 1 },
  cameraOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraFrame: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  cameraHint: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  cameraClose: {
    position: "absolute",
    top: 56,
    right: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
});