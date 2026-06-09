import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

function BrandedSplash({ onDone }: { onDone: () => void }) {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const fromOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(fromOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(900),
    ]).start(() => onDone());
  }, []);

  return (
    <View style={splash.container}>
      <Animated.Image
        source={require("../assets/splash.png")}
        style={[
          splash.logo,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      />
      <View style={splash.footer}>
        <Animated.Text style={[splash.from, { opacity: fromOpacity }]}>
          from
        </Animated.Text>
        <Animated.Text style={[splash.name, { opacity: nameOpacity }]}>
          Shaho
        </Animated.Text>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [showBranded, setShowBranded] = useState(true);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || showBranded) {
    return (
      <>
        <BrandedSplash onDone={() => setShowBranded(false)} />
        <Toast />
      </>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/verify-otp" />
        <Stack.Screen name="(auth)/forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-account/index" />
        <Stack.Screen name="add-account/manual" />
        <Stack.Screen name="edit-account/[id]" />
       <Stack.Screen name="legal/terms" />
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
}

const splash = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 0,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
    gap: 4,
  },
  from: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 16,
    color: "#0e1f42",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
