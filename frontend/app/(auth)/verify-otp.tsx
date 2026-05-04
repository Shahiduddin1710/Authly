import { API_BASE_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";

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
    idx: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
      const updated = [...otp];
      updated[idx - 1] = "";
      setOtp(updated);
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
      Alert.alert("Success", "Account verified successfully!", [
        {
          text: "Log In",
          onPress: () => router.replace("/(auth)/login" as any),
        },
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
      Alert.alert("Sent", "A new OTP has been sent to your email.");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(
        /(.{2})(.*)(@.*)/,
        (_, a, b, c) => a + "*".repeat(b.length) + c,
      )
    : "";

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
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#0e1f42" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoBox}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>

        {/* Shield Icon Badge */}
        <View style={styles.shieldBadge}>
          <Ionicons name="shield-checkmark" size={22} color="#2563eb" />
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Verify Your Email</Text>
        <Text style={styles.subheading}>
          We sent a 6-digit code to{"\n"}
          <Text style={styles.emailHighlight}>{maskedEmail}</Text>
        </Text>

        <View style={styles.divider} />

        {/* OTP Input Row */}
        <View style={styles.form}>
          <Text style={styles.codeLabel}>VERIFICATION CODE</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(r: TextInput | null) => {
                  inputs.current[idx] = r;
                }}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                value={digit}
                onChangeText={(v) => handleChange(v.slice(-1), idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor="#2563eb"
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Verify Code</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Resend Row */}
          <View style={styles.resendContainer}>
            {countdown > 0 ? (
              <View style={styles.countdownRow}>
                <Ionicons name="time-outline" size={15} color="#94a3b8" />
                <Text style={styles.countdownText}>
                  Resend code in{" "}
                  <Text style={styles.countdownTimer}>
                    00:{countdown.toString().padStart(2, "0")}
                  </Text>
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.resendBtn}
                onPress={handleResend}
                disabled={resending}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="refresh-outline"
                  size={15}
                  color={resending ? "#94a3b8" : "#2563eb"}
                />
                <Text
                  style={[
                    styles.resendText,
                    resending && styles.resendTextDisabled,
                  ]}
                >
                  {resending ? "Sending new code..." : "Resend code"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Security note */}
          <View style={styles.secureNote}>
            <Ionicons name="lock-closed-outline" size={12} color="#94a3b8" />
            <Text style={styles.secureText}>
              Secured with AES-256 encryption
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
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  logoBox: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoImg: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  shieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
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
    lineHeight: 22,
    marginBottom: 24,
  },
  emailHighlight: {
    color: "#0e1f42",
    fontWeight: "700",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 28,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 28,
  },
  otpBox: {
    flex: 1,
    height: 58,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    fontSize: 22,
    fontWeight: "800",
    color: "#0e1f42",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  otpBoxFilled: {
    borderColor: "#0e1f42",
    backgroundColor: "#f0f4ff",
  },
  button: {
    backgroundColor: "#0e1f42",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  countdownText: {
    fontSize: 13,
    color: "#94a3b8",
  },
  countdownTimer: {
    color: "#0e1f42",
    fontWeight: "700",
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  resendText: {
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "600",
  },
  resendTextDisabled: {
    color: "#94a3b8",
  },
  secureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 24,
  },
  secureText: {
    fontSize: 11,
    color: "#94a3b8",
    letterSpacing: 0.3,
  },
});
