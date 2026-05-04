import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

function SkeletonBox({ style }: { style: any }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, backgroundColor: "#e5e7eb" }, style]} />
  );
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.left}>
          <SkeletonBox style={styles.circle} />
          <View style={{ gap: 6 }}>
            <SkeletonBox style={styles.lineWide} />
            <SkeletonBox style={styles.lineNarrow} />
          </View>
        </View>
        <SkeletonBox style={styles.timerCircle} />
      </View>
      <View style={styles.otpRow}>
        {[0, 1, 2].map((i) => (
          <SkeletonBox key={i} style={styles.otpBlock} />
        ))}
        <View style={{ width: 8 }} />
        {[3, 4, 5].map((i) => (
          <SkeletonBox key={i} style={styles.otpBlock} />
        ))}
      </View>
      <View style={styles.cardBottom}>
        <SkeletonBox style={styles.copyLine} />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <SkeletonBox style={styles.actionBtn} />
          <SkeletonBox style={styles.actionBtn} />
        </View>
      </View>
      <SkeletonBox style={styles.progressBar} />
    </View>
  );
}

export default function VaultSkeleton() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  circle: { width: 46, height: 46, borderRadius: 12 },
  timerCircle: { width: 38, height: 38, borderRadius: 19 },
  lineWide: { width: 100, height: 12, borderRadius: 6 },
  lineNarrow: { width: 70, height: 10, borderRadius: 5 },
  otpRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
    alignItems: "center",
  },
  otpBlock: { width: 28, height: 36, borderRadius: 6 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  copyLine: { width: 80, height: 10, borderRadius: 5 },
  actionBtn: { width: 32, height: 32, borderRadius: 8 },
  progressBar: { height: 3, borderRadius: 2, width: "100%" },
});
