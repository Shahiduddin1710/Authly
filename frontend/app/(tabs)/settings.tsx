import AuthInput from "@/components/AuthInput";
import { API_BASE_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type Screen = "main" | "profile" | "security" | "legal" | "changePassword";

export default function SettingsScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileVisible, setProfileVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("main");
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const navigateTo = (s: Screen) => {
    setScreenHistory((prev) => [...prev, screen]);
    setScreen(s);
  };

const goBack = () => {
    setScreenHistory((prev) => {
      const next = [...prev];
      const last = next.pop();
      setScreen(last || "main");
      return next;
    });
  };

  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPwError("Must contain at least one uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPwError("Must contain at least one number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwLoading(true);
    try {
      const uid = await AsyncStorage.getItem("uid");
      await axios.post(`${API_BASE_URL}/auth/change-password`, {
        uid,
        currentPassword,
        newPassword,
      });
      setPwSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwError(err.response?.data?.error || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

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
  mediaTypes: ["images"],
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

if (screen === "profile") {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={{ marginBottom: 12 }}>
            <Ionicons name="arrow-back" size={22} color="#0e1f42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Details</Text>
        </View>

        <View style={[styles.profileCard, { flexDirection: 'column', alignItems: 'center', gap: 12 }]}>
          <TouchableOpacity style={[styles.avatar, { width: 72, height: 72, borderRadius: 36 }]} onPress={handlePickImage}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={[styles.avatarImage, { borderRadius: 36 }]} />
            ) : (
              <Text style={[styles.avatarText, { fontSize: 28 }]}>{fullName ? fullName[0].toUpperCase() : "?"}</Text>
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={10} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, { fontSize: 18 }]}>{fullName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <View style={[styles.section, { marginTop: 8 }]}>
          <View style={styles.menuCard}>
            {[
              { label: "Full Name", value: fullName, icon: "person-outline" },
              { label: "Email Address", value: email, icon: "mail-outline" },
              { label: "Account Status", value: "Verified", icon: "checkmark-circle-outline", color: "#059669" },
            ].map((item, i, arr) => (
              <View key={item.label}>
                <View style={[styles.menuItem, { gap: 14 }]}>
                  <View style={styles.menuIconBox}>
                    <Ionicons name={item.icon as any} size={18} color="#2563eb" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 }}>{item.label}</Text>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: item.color || "#111827" }}>{item.value}</Text>
                  </View>
                </View>
                {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: "#f3f4f6", marginLeft: 64 }} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  if (screen === "security") {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={{ marginBottom: 12 }}>
            <Ionicons name="arrow-back" size={22} color="#0e1f42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.menuCard}>
            {[
             { label: "Change Password", icon: "lock-closed-outline", color: "#059669", bg: "#f0fdf4", onPress: () => navigateTo("changePassword") },
             { label: "Logout All Devices", icon: "phone-portrait-outline", color: "#059669", bg: "#f0fdf4", onPress: () => Alert.alert("Logout All Devices", "This will end all active sessions.", [{ text: "Cancel", style: "cancel" }, { text: "Confirm", style: "destructive", onPress: async () => {
  try {
    const uid = await AsyncStorage.getItem("uid");
    await axios.post(`${API_BASE_URL}/auth/logout-all-devices`, { uid });
  } catch {}
  await AsyncStorage.clear();
  router.replace("/(auth)/login" as any);
} }]) },
            { label: "Delete Account", icon: "trash-outline", color: "#ef4444", bg: "#fff1f2", onPress: () => {
  Alert.alert(
    "Delete Account",
    "Are you sure you want to delete your account? This will permanently remove all your data.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, Delete", style: "destructive", onPress: () => {
        Alert.alert(
          "Final Warning",
          "This action is irreversible. All your 2FA accounts and data will be lost forever. Continue?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete Forever", style: "destructive", onPress: async () => {
              try {
                const uid = await AsyncStorage.getItem("uid");
                await axios.delete(`${API_BASE_URL}/auth/delete-account`, { data: { uid } });
              } catch {}
              await AsyncStorage.clear();
              router.replace("/(auth)/login" as any);
            }}
          ]
        );
      }}
    ]
  );
}},
            ].map((item, i, arr) => (
              <View key={item.label}>
                <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                  <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.menuLabel, { color: item.color === "#ef4444" ? "#ef4444" : "#111827" }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: "#f3f4f6", marginLeft: 64 }} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

if (screen === "changePassword") {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#f8faff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={{ marginBottom: 12 }}>
              <Ionicons name="arrow-back" size={22} color="#0e1f42" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>

          <View style={[styles.section, { marginTop: 8 }]}>
            <View style={[styles.menuCard, { padding: 16, gap: 4 }]}>
              <AuthInput
                label="Current Password"
                iconName="lock-closed-outline"
                placeholder="Enter current password"
                isPassword
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <AuthInput
                label="New Password"
                iconName="lock-open-outline"
                placeholder="Enter new password"
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <AuthInput
                label="Confirm New Password"
                iconName="lock-open-outline"
                placeholder="Confirm new password"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <View style={{ gap: 6, marginTop: 8 }}>
                {[
                  { rule: "At least 8 characters", ok: newPassword.length >= 8 },
                  { rule: "One uppercase letter", ok: /[A-Z]/.test(newPassword) },
                  { rule: "One number", ok: /[0-9]/.test(newPassword) },
                  { rule: "Passwords match", ok: newPassword === confirmPassword && confirmPassword.length > 0 },
                ].map((r) => (
                  <View key={r.rule} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name={r.ok ? "checkmark-circle" : "ellipse-outline"} size={14} color={r.ok ? "#059669" : "#9ca3af"} />
                    <Text style={{ fontSize: 12, color: r.ok ? "#059669" : "#9ca3af" }}>{r.rule}</Text>
                  </View>
                ))}
              </View>

              {pwError ? <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600", marginTop: 8 }}>{pwError}</Text> : null}
              {pwSuccess ? <Text style={{ color: "#059669", fontSize: 13, fontWeight: "600", marginTop: 8 }}>{pwSuccess}</Text> : null}

              <TouchableOpacity
                style={[styles.dangerBtn, { backgroundColor: "#0e1f42", borderColor: "#0e1f42", marginTop: 16 }, (pwLoading || !currentPassword || !newPassword || !confirmPassword) && { opacity: 0.6 }]}
                onPress={handleChangePassword}
                disabled={pwLoading || !currentPassword || !newPassword || !confirmPassword}
              >
                {pwLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.dangerText, { color: "#fff" }]}>Change Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (screen === "legal") {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={{ marginBottom: 12 }}>
            <Ionicons name="arrow-back" size={22} color="#0e1f42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Legal</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.menuCard}>
            {[
              { label: "Terms & Conditions", icon: "document-text-outline", url: "https://authlyapp.vercel.app/terms" },
              { label: "Privacy Policy", icon: "shield-checkmark-outline", url: "https://authlyapp.vercel.app/privacy" },
              { label: "Copyright Policy", icon: "copy-outline", url: "https://authlyapp.vercel.app/copyright" },
            ].map((item, i, arr) => (
              <View key={item.label}>
                <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(item.url)}>
                  <View style={[styles.menuIconBox, { backgroundColor: "#f0f9ff" }]}>
                    <Ionicons name={item.icon as any} size={18} color="#0ea5e9" />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: "#f3f4f6", marginLeft: 64 }} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

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
          {[
            { label: "Profile", icon: "person-outline", bg: "#eff6ff", color: "#2563eb", onPress: () => navigateTo("profile") },
            { label: "Security", icon: "lock-closed-outline", bg: "#f0fdf4", color: "#059669", onPress: () => navigateTo("security") },
            { label: "Legal", icon: "document-text-outline", bg: "#f0f9ff", color: "#0ea5e9", onPress: () => navigateTo("legal") },
          ].map((item, i, arr) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: "#f3f4f6", marginLeft: 64 }} />}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.dangerText}>Logout</Text>
        </TouchableOpacity>
      </View>

    
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
