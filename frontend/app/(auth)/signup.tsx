import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/api";
import AuthInput from "@/components/AuthInput";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, { fullName, email, password });
      router.push({ pathname: "/(auth)/verify-otp", params: { email } });
    } catch (err: any) {
      Alert.alert("Signup Failed", err.response?.data?.error || "Something went wrong");
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
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Ionicons name="shield-checkmark" size={20} color="#2563eb" />
            <Text style={styles.brandName}>SafeAuth</Text>
          </View>
          <Text style={styles.heading}>Sign Up</Text>
          <Text style={styles.subheading}>Create your secure digital vault</Text>
        </View>

        <View style={styles.card}>
          <AuthInput
            label="Full Name"
            iconName="person-outline"
            placeholder="Enter your name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <AuthInput
            label="Email"
            iconName="mail-outline"
            placeholder="shaho@gmail.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <AuthInput
            label="Password"
            iconName="lock-closed-outline"
            placeholder="••••••••"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          <AuthInput
            label="Confirm Password"
            iconName="lock-closed-outline"
            placeholder="••••••••"
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

      

      <View style={styles.bottomRow}>
  <TouchableOpacity onPress={() => router.push("/privacy" as any)}>
    <Text style={styles.bottomLink}>PRIVACY POLICY</Text>
  </TouchableOpacity>
  <Text style={styles.bottomDot}>·</Text>
  <TouchableOpacity onPress={() => router.push("/terms" as any)}>
    <Text style={styles.bottomLink}>TERMS OF SERVICE</Text>
  </TouchableOpacity>
</View>
<Text style={styles.copy}>© 2026 SafeAuth Global Security Systems.</Text>
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
  header: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563eb",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#9ca3af",
  },
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
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  footerLink: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "700",
  },
  trustRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
    maxWidth: 400,
  },
  trustBadge: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  trustText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#374151",
    lineHeight: 15,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  bottomLink: {
    fontSize: 10,
    color: "#9ca3af",
    letterSpacing: 0.5,
  },
  bottomDot: {
    color: "#d1d5db",
  },
  copy: {
    fontSize: 10,
    color: "#d1d5db",
    marginTop: 6,
    marginBottom: 24,
  },
});