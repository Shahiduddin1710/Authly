import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <Ionicons name="shield-checkmark" size={18} color="#2563eb" />
          <Text style={styles.brandName}>SafeAuth</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Terms of Service</Text>
        <Text style={styles.date}>Last updated: April 2, 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.body}>
            By downloading, installing, or using SafeAuth, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.body}>
            SafeAuth is a two-factor authentication (2FA) application that securely stores and generates time-based one-time passwords (TOTP) for your online accounts. The service is provided as-is and we reserve the right to modify or discontinue the service at any time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.body}>
            You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your account with others or use the service for any unlawful purpose. You are responsible for all activities that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Security</Text>
          <Text style={styles.body}>
            While we implement strong security measures, no method of electronic storage is 100% secure. We strongly recommend enabling device-level security such as PIN, fingerprint, or face recognition to protect access to your device and the SafeAuth application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Backup & Data Loss</Text>
          <Text style={styles.body}>
            SafeAuth syncs your data to Firebase cloud storage. However, we strongly recommend you keep backup copies of your 2FA secret keys. We are not liable for any data loss resulting from account deletion, device failure, or service disruption.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Prohibited Activities</Text>
          <Text style={styles.body}>
            You may not use SafeAuth to store unauthorized credentials, attempt to reverse engineer the application, circumvent any security measures, or use the service for any illegal or harmful activities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.body}>
            All content, features, and functionality of SafeAuth including but not limited to the design, code, and branding are the exclusive property of SafeAuth Global Security Systems and are protected by international copyright laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.body}>
            SafeAuth shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, including but not limited to loss of data or account access.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Termination</Text>
          <Text style={styles.body}>
            We reserve the right to terminate or suspend your account at any time for violations of these terms. You may also delete your account at any time through the Settings page.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact</Text>
          <Text style={styles.body}>
            For any questions regarding these Terms of Service, please contact us at techshaho786@gmail.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={20} color="#2563eb" />
          <Text style={styles.footerText}>© 2024 SafeAuth Global Security Systems</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandName: { fontSize: 15, fontWeight: "800", color: "#2563eb" },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 28,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },
  body: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});