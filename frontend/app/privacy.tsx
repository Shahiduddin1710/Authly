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

export default function PrivacyScreen() {
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
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.date}>Last updated: April 2, 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.body}>
            SafeAuth collects only the information necessary to provide our authentication services. This includes your full name, email address, and encrypted 2FA secret keys. We do not collect any payment information, location data, or unnecessary personal details.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.body}>
            Your information is used solely to provide and improve the SafeAuth service. We use your email address for account verification and password recovery. Your 2FA secret keys are stored encrypted and are never shared with third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Storage & Security</Text>
          <Text style={styles.body}>
            All data is stored securely on Firebase Firestore with industry-standard encryption. Your passwords are hashed using bcrypt before storage. We implement end-to-end encryption practices to ensure your authentication data remains private and secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Sharing</Text>
          <Text style={styles.body}>
            We do not sell, trade, or transfer your personal information to third parties. We do not display advertisements. Your data is never shared with advertisers or marketing companies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.body}>
            You have the right to access, update, or delete your personal data at any time. You can delete your account and all associated data by contacting our support team. We will process your request within 30 days.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cookies</Text>
          <Text style={styles.body}>
            SafeAuth does not use cookies or tracking technologies in our mobile application. We do not track your behavior across other websites or applications.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
          <Text style={styles.body}>
            We may update this privacy policy from time to time. We will notify you of any significant changes via email or through the app. Continued use of the service after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contact Us</Text>
          <Text style={styles.body}>
            If you have any questions about this Privacy Policy, please contact us at techshaho786@gmail.com
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