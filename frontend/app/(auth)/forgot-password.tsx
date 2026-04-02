import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { API_BASE_URL } from "@/constants/api";
import AuthInput from "@/components/AuthInput";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setStep("otp");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }
    setStep("password");
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword,
      });
      Alert.alert("Success", "Password reset successfully!", [
        { text: "Login", onPress: () => router.replace("/(auth)/login" as any) },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    idx: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        <View style={styles.logoBox}>
          <View style={styles.logoCircle}>
            <Ionicons name="lock-open-outline" size={28} color="#2563eb" />
          </View>
          <Text style={styles.brandName}>SafeAuth</Text>
        </View>

        <View style={styles.card}>
          {step === "email" && (
            <>
              <Text style={styles.heading}>Forgot Password</Text>
              <Text style={styles.subheading}>
                {"Enter your email address and we'll send you a reset code."}
              </Text>
              <AuthInput
                label="Email Address"
                iconName="mail-outline"
                placeholder="name@company.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Code</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === "otp" && (
            <>
              <Text style={styles.heading}>Enter Code</Text>
              <Text style={styles.subheading}>
                Enter the 6-digit code sent to {email}
              </Text>
              <Text style={styles.otpLabel}>VERIFICATION CODE</Text>
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(r: TextInput | null) => { inputs.current[idx] = r; }}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v.slice(-1), idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Verify Code</Text>
              </TouchableOpacity>
            </>
          )}

          {step === "password" && (
            <>
              <Text style={styles.heading}>New Password</Text>
              <Text style={styles.subheading}>
                Create a new secure password for your account.
              </Text>
              <AuthInput
                label="New Password"
                iconName="lock-closed-outline"
                placeholder="••••••••"
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <AuthInput
                label="Confirm Password"
                iconName="lock-closed-outline"
                placeholder="••••••••"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace("/(auth)/login" as any)}>
            <Ionicons name="arrow-back" size={14} color="#2563eb" />
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
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
  backBtn: {
    alignSelf: "flex-start",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  logoBox: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  brandName: { fontSize: 20, fontWeight: "800", color: "#2563eb" },
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
  heading: { fontSize: 22, fontWeight: "800", color: "#111827", marginBottom: 6 },
  subheading: { fontSize: 13, color: "#9ca3af", marginBottom: 24, lineHeight: 20 },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  otpLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 1,
    marginBottom: 10,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 24,
  },
  otpBox: {
    flex: 1,
    height: 52,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  otpBoxFilled: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  backToLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
  },
  backToLoginText: { fontSize: 13, color: "#2563eb", fontWeight: "600" },
});