import { API_BASE_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SecurityScreen() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
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

  const handleSync = async () => {
    setSyncing(true);
    try {
      const uid = await AsyncStorage.getItem("uid");
      if (!uid) return;
      await axios.get(`${API_BASE_URL}/accounts/${uid}`);
      const now = new Date().toLocaleTimeString();
      setLastSync(now);
     showToast("Vault is up to date with the cloud.", "success");
    } catch {
      showToast("Sync failed. Check your connection.", "error");
    } finally {
      setSyncing(false);
    }
  };

 return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Ionicons name="shield-checkmark" size={18} color="#0e1f42" />
          <Text style={styles.brandName}>Authly</Text>
        </View>
        <Text style={styles.headerTitle}>Security</Text>
        <Text style={styles.headerSub}>
          Manage your encrypted authentication database and backup preferences.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={[styles.iconBox, { backgroundColor: "#f0fdf4" }]}>
              <Ionicons name="cloud-outline" size={20} color="#059669" />
            </View>
            <View>
              <Text style={styles.statusTitle}>Cloud Sync</Text>
              <Text style={styles.statusSub}>
                {lastSync ? `Last synced at ${lastSync}` : "Firebase Firestore"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.syncBtn, syncing && { opacity: 0.7 }]}
            onPress={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : (
              <Ionicons name="sync-outline" size={18} color="#059669" />
            )}
            <Text style={styles.syncText}>
              {syncing ? "Syncing" : "Sync Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
</ScrollView>
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
  container: { flex: 1, backgroundColor: "#f8faff" },
  header: {
    backgroundColor: "#f8faff",
    padding: 20,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  brandName: { fontSize: 15, fontWeight: "800", color: "#0e1f42" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0e1f42",
    marginBottom: 4,
  },
  headerSub: { fontSize: 12, color: "#9ca3af", lineHeight: 18 },
  section: { padding: 16, gap: 12 },
  statusCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statusLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statusTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  statusSub: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
syncText: { fontSize: 12, fontWeight: "700", color: "#059669" },
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
});
