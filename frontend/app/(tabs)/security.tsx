import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@/constants/api";

export default function SecurityScreen() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const uid = await AsyncStorage.getItem("uid");
      if (!uid) return;
      await axios.get(`${API_BASE_URL}/accounts/${uid}`);
      const now = new Date().toLocaleTimeString();
      setLastSync(now);
      Alert.alert("Synced", "Your vault is up to date with the cloud.");
    } catch {
      Alert.alert("Error", "Sync failed. Check your connection.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Ionicons name="shield-checkmark" size={18} color="#2563eb" />
          <Text style={styles.brandName}>SafeAuth</Text>
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
            <Text style={styles.syncText}>{syncing ? "Syncing" : "Sync Now"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    marginBottom: 16,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  brandName: { fontSize: 15, fontWeight: "800", color: "#2563eb" },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 4 },
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
});