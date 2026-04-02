import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  useEffect(() => {
    const check = async () => {
      const uid = await AsyncStorage.getItem("uid");
      if (uid) {
        router.replace("/(tabs)/vault" as any);
      } else {
        router.replace("/(auth)/login" as any);
      }
    };
    check();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f4f8" }}>
      <ActivityIndicator size="large" color="#0d7377" />
    </View>
  );
}