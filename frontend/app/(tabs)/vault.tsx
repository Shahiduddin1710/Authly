import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Clipboard,
  Image,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/api";

interface Account {
  id: string;
  serviceName: string;
  accountEmail: string;
  secretKey: string;
}

const SERVICE_DOMAINS: Record<string, string> = {
  google: "google.com",
  gmail: "google.com",
  github: "github.com",
  facebook: "facebook.com",
  instagram: "instagram.com",
  microsoft: "microsoft.com",
  twitter: "twitter.com",
  x: "x.com",
  apple: "apple.com",
  slack: "slack.com",
  discord: "discord.com",
  amazon: "amazon.com",
  aws: "amazon.com",
  dropbox: "dropbox.com",
  linkedin: "linkedin.com",
  netflix: "netflix.com",
  paypal: "paypal.com",
  stripe: "stripe.com",
  shopify: "shopify.com",
  notion: "notion.so",
  figma: "figma.com",
  vercel: "vercel.com",
  cloudflare: "cloudflare.com",
  digitalocean: "digitalocean.com",
  gitlab: "gitlab.com",
  bitbucket: "bitbucket.org",
  atlassian: "atlassian.com",
  jira: "atlassian.com",
  zoom: "zoom.us",
  twilio: "twilio.com",
  heroku: "heroku.com",
  reddit: "reddit.com",
  snapchat: "snapchat.com",
  tiktok: "tiktok.com",
  spotify: "spotify.com",
  binance: "binance.com",
  coinbase: "coinbase.com",
  wordpress: "wordpress.com",
  steam: "steampowered.com",
  epic: "epicgames.com",
  adobe: "adobe.com",
  yahoo: "yahoo.com",
  proton: "proton.me",
  protonmail: "proton.me",
  bitwarden: "bitwarden.com",
  cloudinary: "cloudinary.com",
  mongodb: "mongodb.com",
  supabase: "supabase.com",
  firebase: "firebase.google.com",
  twitch: "twitch.tv",
  youtube: "youtube.com",
  whatsapp: "whatsapp.com",
  telegram: "telegram.org",
  signal: "signal.org",
};

const getServiceLogo = (name: string): string | null => {
  const lower = name.toLowerCase();
  for (const key of Object.keys(SERVICE_DOMAINS)) {
    if (lower.includes(key)) {
      const domain = SERVICE_DOMAINS[key];
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
  }
  return `https://www.google.com/s2/favicons?domain=${lower.replace(/\s/g, "")}.com&sz=128`;
};

const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

const getColor = (name: string): string => {
  const colors = ["#2563eb", "#7c3aed", "#db2777", "#059669", "#d97706", "#dc2626", "#0891b2"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash;
  return colors[hash % colors.length];
};

export default function VaultScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uid, setUid] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const fetchCodes = async (accs: Account[]) => {
    const newCodes: Record<string, string> = {};
    await Promise.all(
      accs.map(async (acc) => {
        try {
          const res = await axios.post(`${API_BASE_URL}/accounts/generate-totp`, {
            secretKey: acc.secretKey,
          });
          const data = res.data as { code: string; timeLeft: number };
          newCodes[acc.id] = data.code;
          setTimeLeft(data.timeLeft);
        } catch {
          newCodes[acc.id] = "------";
        }
      })
    );
    setCodes(newCodes);
  };

  const fetchAccounts = async (userId: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/accounts/${userId}`);
      const data = res.data as { accounts: Account[] };
      setAccounts(data.accounts);
      await fetchCodes(data.accounts);
    } catch (err) {
      console.log("fetch error", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const userId = await AsyncStorage.getItem("uid");
        if (!userId) {
          router.replace("/(auth)/login" as any);
          return;
        }
        setUid(userId);
        await fetchAccounts(userId);
      };
      load();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const secs = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(secs);
      if (secs === 30 && accounts.length > 0) {
        await fetchCodes(accounts);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [accounts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAccounts(uid);
  };

  const handleCopy = (id: string, code: string) => {
    Clipboard.setString(code.replace(" ", ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (accountId: string, serviceName: string) => {
    Alert.alert("Remove Account", `Remove ${serviceName} from your vault?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await axios.delete(`${API_BASE_URL}/accounts/${uid}/${accountId}`);
          await fetchAccounts(uid);
        },
      },
    ]);
  };

  const handleEdit = (item: Account) => {
    router.push({
      pathname: "/edit-account/[id]",
      params: {
        id: item.id,
        serviceName: item.serviceName,
        accountEmail: item.accountEmail,
        secretKey: item.secretKey,
      },
    } as any);
  };

  const renderItem = ({ item }: { item: Account }) => {
    const code = codes[item.id] || "------";
    const displayCode = `${code.slice(0, 3)} ${code.slice(3)}`;
    const color = getColor(item.serviceName);
    const isCopied = copiedId === item.id;
    const logoUrl = getServiceLogo(item.serviceName);
    const logoFailed = logoErrors[item.id];

    return (
      <View style={styles.accountCard}>
        <View style={styles.cardTop}>
          <View style={styles.accountLeft}>
            <View style={[styles.iconBox, { backgroundColor: color + "18" }]}>
              {logoUrl && !logoFailed ? (
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.logoImage}
                  onError={() =>
                    setLogoErrors((prev) => ({ ...prev, [item.id]: true }))
                  }
                />
              ) : (
                <Text style={[styles.initials, { color }]}>
                  {getInitials(item.serviceName)}
                </Text>
              )}
            </View>
            <View>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
              {item.accountEmail ? (
                <Text style={styles.accountEmail}>{item.accountEmail}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.timerCircle}>
            <Text style={[styles.timerText, timeLeft <= 5 && { color: "#ef4444" }]}>
              {timeLeft}s
            </Text>
          </View>
        </View>

        <Text style={[styles.otpCode, { color }]}>{displayCode}</Text>

        <View style={styles.cardBottom}>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => handleCopy(item.id, code)}
          >
            <Ionicons
              name={isCopied ? "checkmark" : "copy-outline"}
              size={13}
              color={isCopied ? "#059669" : "#6b7280"}
            />
            <Text style={[styles.copyText, isCopied && { color: "#059669" }]}>
              {isCopied ? "COPIED" : "TAP TO COPY"}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionBtns}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="pencil-outline" size={15} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id, item.serviceName)}
            >
              <Ionicons name="trash-outline" size={15} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(timeLeft / 30) * 100}%` as any,
                backgroundColor: timeLeft <= 5 ? "#ef4444" : color,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={18} color="#2563eb" />
          <Text style={styles.brandName}>SafeAuth</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/add-account" as any)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : accounts.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="lock-closed-outline" size={40} color="#d1d5db" />
          </View>
          <Text style={styles.emptyTitle}>No accounts yet</Text>
          <Text style={styles.emptyText}>
            Add your first 2FA account to keep your digital life protected.
          </Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/add-account" as any)}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add Security Key</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2563eb"
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-account" as any)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandName: { fontSize: 16, fontWeight: "800", color: "#2563eb" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 8 },
  emptyText: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  addBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  list: { padding: 16, gap: 12 },
  accountCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  accountLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
 iconBox: {
  width: 46,
  height: 46,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  backgroundColor: "#f8fafc",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  padding: 6,
},
logoImage: {
  width: "100%" as any,
  height: "100%" as any,
  resizeMode: "contain",
},
  initials: { fontSize: 14, fontWeight: "800" },
  serviceName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  accountEmail: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  timerCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: { fontSize: 11, fontWeight: "700", color: "#6b7280" },
  otpCode: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 4,
    marginBottom: 12,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  copyText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  actionBtns: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fff1f2",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#f3f4f6",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});