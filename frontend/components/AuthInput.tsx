import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface AuthInputProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  rightLabel?: string;
  onRightLabelPress?: () => void;
}

export default function AuthInput({
  label,
  iconName,
  isPassword = false,
  rightLabel,
  onRightLabelPress,
  ...props
}: AuthInputProps) {
  const [secure, setSecure] = useState(isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {rightLabel && (
          <TouchableOpacity onPress={onRightLabelPress}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.inputContainer, focused && styles.inputFocused]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={16}
            color={focused ? "#2563eb" : "#9ca3af"}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          secureTextEntry={secure}
          placeholderTextColor="#b0b8c1"
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  rightLabel: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
});