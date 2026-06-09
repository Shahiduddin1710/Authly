import AuthInput from "@/components/AuthInput";
import { API_BASE_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        fullName,
        email,
        password,
      });
      router.push({ pathname: "/(auth)/verify-otp", params: { email } });
    } catch (err: any) {
      Alert.alert(
        "Signup Failed",
        err.response?.data?.error || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8faff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#0e1f42" />
        </TouchableOpacity>

        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>
          Join Authly and secure your accounts
        </Text>

        <View style={styles.form}>
          <AuthInput
            label="Full Name"
            iconName="person-outline"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <AuthInput
            label="Email Address"
            iconName="mail-outline"
            placeholder="you@example.com"
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
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login" as any)}
            >
              <Text style={styles.footerLink}>Log in</Text>
            </TouchableOpacity>
          </View>

     <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/legal/terms", params: { type: "terms" } } as any)}>
              <Text style={styles.bottomLink}>Terms & Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.bottomDot}>·</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "/legal/terms", params: { type: "privacy" } } as any)}>
              <Text style={styles.bottomLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    backgroundColor: "#f8faff",
  },
  backBtn: {
    alignSelf: "flex-start",
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0e1f42",
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: "#64748b",
    alignSelf: "flex-start",
    marginBottom: 28,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#0e1f42",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#64748b",
    fontSize: 14,
  },
  footerLink: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  bottomLink: {
    fontSize: 12,
    color: "#94a3b8",
  },
  bottomDot: {
    color: "#94a3b8",
  },
});
