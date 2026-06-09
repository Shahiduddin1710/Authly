import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function TermsScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const canGoBack = router.canGoBack?.() ?? false;

  const url =
    type === "privacy"
      ? "https://authlyapp.vercel.app/privacy"
      : type === "copyright"
      ? "https://authlyapp.vercel.app/copyright"
      : "https://authlyapp.vercel.app/terms";

  const title =
    type === "privacy"
      ? "Privacy Policy"
      : type === "copyright"
      ? "Copyright Policy"
      : "Terms & Conditions";

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (canGoBack ? router.back() : router.replace("/(auth)/login" as any))}
        >
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.topBarBrand}>{title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 56 : 48,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  topBarBrand: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  webview: { flex: 1 },
});