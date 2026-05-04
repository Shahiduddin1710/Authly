import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

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

  return <View style={{ flex: 1, backgroundColor: "#0e1f42" }} />;
}
