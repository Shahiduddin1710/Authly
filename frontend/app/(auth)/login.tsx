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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/api";
import AuthInput from "@/components/AuthInput";

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
      Alert.alert("Login Failed", err.response?.data?.error || "Something went wrong");
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
        <View style={styles.logoBox}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={32} color="#2563eb" />
          </View>
          <Text style={styles.brandName}>SafeAuth</Text>
          <Text style={styles.brandTagline}>The Ethereal Guardian of your identity</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Login</Text>
          <Text style={styles.cardSub}>Enter your credentials to access your secure vault.</Text>

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
            rightLabel="Forgot?"
            onRightLabelPress={() => router.push("/(auth)/forgot-password" as any)}
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
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Login</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{"Don't have an account? "}</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup" as any)}>
              <Text style={styles.footerLink}>Sign Up</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f6fa",
  },
  logoBox: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  brandName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563eb",
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
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
  cardLabel: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
  },
  bottomLink: {
    fontSize: 12,
    color: "#9ca3af",
  },
  bottomDot: {
    fontSize: 12,
    color: "#d1d5db",
  },
  encrypted: {
    fontSize: 10,
    color: "#d1d5db",
    letterSpacing: 1.5,
    marginTop: 8,
  },
});