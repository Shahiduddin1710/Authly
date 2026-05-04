import AuthInput from "@/components/AuthInput";
import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const data = res.data as { uid: string; fullName: string; email: string };
      await AsyncStorage.setItem("uid", data.uid);
      await AsyncStorage.setItem("fullName", data.fullName);
      await AsyncStorage.setItem("email", data.email);
      router.replace("/(tabs)/vault" as any);
    } catch (err: any) {
      Alert.alert(
        "Login Failed",
        err.response?.data?.error || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8faff", justifyContent: "center" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Sign in to your account</Text>

          <View style={styles.form}>
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
              placeholder="Enter your password"
              isPassword
              rightLabel="Forgot password?"
              onRightLabelPress={() =>
                router.push("/(auth)/forgot-password" as any)
              }
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{"Don't have an account? "}</Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signup" as any)}
              >
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.terms}>
              By continuing, you agree to our{" "}
              <Text
                style={styles.termsLink}
                onPress={() => router.push("/terms" as any)}
              >
                Terms & Conditions
              </Text>
            </Text>
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
    backgroundColor: "#f8faff",
  },

  centerWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 40,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0e1f42",
    alignSelf: "flex-start",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    color: "#94a3b8",
    alignSelf: "flex-start",
    marginBottom: 32,
    lineHeight: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#0e1f42",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#0e1f42",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
  terms: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
