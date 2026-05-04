import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function SettingsScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileVisible, setProfileVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const name = await AsyncStorage.getItem("fullName");
      const mail = await AsyncStorage.getItem("email");
      const avatar = await AsyncStorage.getItem("avatarUri");
      setFullName(name || "");
      setEmail(mail || "");
      setAvatarUri(avatar || null);
    };
    load();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("uid");
            await AsyncStorage.removeItem("fullName");
            await AsyncStorage.removeItem("email");
            router.replace("/(auth)/login" as any);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await AsyncStorage.setItem("avatarUri", uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Ionicons name="shield-checkmark" size={18} color="#0e1f42" />
          <Text style={styles.brandName}>Authly</Text>
        </View>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <TouchableOpacity style={styles.avatar} onPress={handlePickImage}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {fullName ? fullName[0].toUpperCase() : "?"}
            </Text>
          )}
          <View style={styles.avatarEditBadge}>
            <Ionicons name="camera" size={10} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#059669" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setProfileVisible(true)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "#eff6ff" }]}>
              <Ionicons name="person-outline" size={18} color="#2563eb" />
            </View>
            <Text style={styles.menuLabel}>Profile</Text>
            <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.dangerText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={profileVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Details</Text>
              <TouchableOpacity
                onPress={() => setProfileVisible(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalAvatar}
              onPress={handlePickImage}
            >
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.modalAvatarImage}
                />
              ) : (
                <Text style={styles.modalAvatarText}>
                  {fullName ? fullName[0].toUpperCase() : "?"}
                </Text>
              )}
              <View style={styles.modalAvatarEditBadge}>
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.detailRow}>
              <View style={styles.detailIconBox}>
                <Ionicons name="person-outline" size={18} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{fullName}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconBox}>
                <Ionicons name="mail-outline" size={18} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Email Address</Text>
                <Text style={styles.detailValue}>{email}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View
                style={[styles.detailIconBox, { backgroundColor: "#f0fdf4" }]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#059669"
                />
              </View>
              <View>
                <Text style={styles.detailLabel}>Account Status</Text>
                <Text style={[styles.detailValue, { color: "#059669" }]}>
                  Verified
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setProfileVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8faff" },
  header: {
    backgroundColor: "#ffffff",
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
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#0e1f42" },
  profileCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0e1f42",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "visible",
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#0e1f42",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  profileName: { fontSize: 15, fontWeight: "700", color: "#0e1f42" },
  profileEmail: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: "#059669" },
  section: { padding: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 1,
    marginBottom: 10,
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff6ff",
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111827" },
  dangerBtn: {
    backgroundColor: "#fff1f2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  dangerText: { color: "#ef4444", fontSize: 15, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#0e1f42" },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0e1f42",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
    position: "relative",
    overflow: "visible",
  },
  modalAvatarText: { color: "#fff", fontSize: 28, fontWeight: "800" },
  modalAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
  },
  modalAvatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0e1f42",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  detailIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "600",
    marginBottom: 3,
  },
  detailValue: { fontSize: 15, fontWeight: "700", color: "#111827" },
  detailDivider: { height: 1, backgroundColor: "#f3f4f6" },
  modalCloseBtn: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  modalCloseBtnText: { fontSize: 15, fontWeight: "700", color: "#374151" },
});
