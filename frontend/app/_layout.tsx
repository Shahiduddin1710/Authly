import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
      <Stack.Screen name="privacy" />
      <Stack.Screen name="terms" />
    </Stack>
  );
}