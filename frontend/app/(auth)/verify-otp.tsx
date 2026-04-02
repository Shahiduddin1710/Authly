import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/api";

export default function VerifyOTPScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown === 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleChange = (val: string, idx: number) => {
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

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp: code });
      Alert.alert("Success", "Account created successfully!", [
        { text: "Login", onPress: () => router.replace("/(auth)/login" as any) },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email });
      setCountdown(59);
      Alert.alert("Sent", "A new OTP has been sent to your email");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.brandRow}>
          <Ionicons name="shield-checkmark" size={18} color="#2563eb" />
          <Text style={styles.brandName}>SafeAuth</Text>
        </View>

        <Text style={styles.heading}>Verify OTP</Text>
        <Text style={styles.subheading}>
          Enter the 6-digit code sent to your email
        </Text>

        <Text style={styles.inputLabel}>VERIFICATION CODE</Text>
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r: TextInput | null) => { inputs.current[idx] = r; }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v.slice(-1), idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>Verify</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Ionicons name="refresh-circle-outline" size={16} color="#9ca3af" />
          <Text style={styles.resendLabel}>
            {countdown > 0
              ? `00:${countdown.toString().padStart(2, "0")}`
              : ""}
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={countdown > 0 || resending}>
            <Text style={[styles.resendLink, countdown > 0 && styles.resendDisabled]}>
              {resending ? "Sending..." : "Didn't receive? Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secureRow}>
          <Ionicons name="lock-closed" size={12} color="#9ca3af" />
          <Text style={styles.secureText}>SECURE SESSION AES-256</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  brandName: { fontSize: 15, fontWeight: "800", color: "#2563eb" },
  heading: { fontSize: 24, fontWeight: "800", color: "#111827", marginBottom: 6 },
  subheading: { fontSize: 13, color: "#9ca3af", lineHeight: 20, marginBottom: 24 },
  inputLabel: {
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
    marginBottom: 28,
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
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },
  resendLabel: { fontSize: 12, color: "#6b7280" },
  resendLink: { fontSize: 12, color: "#2563eb", fontWeight: "600" },
  resendDisabled: { color: "#9ca3af" },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 10,
  },
  secureText: {
    fontSize: 10,
    color: "#9ca3af",
    letterSpacing: 1,
    fontWeight: "600",
  },
});