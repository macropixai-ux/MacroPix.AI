import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown, FadeIn,
  useSharedValue, useAnimatedStyle,
  withSpring, withRepeat, withSequence, withTiming, withDelay,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';

const LOCKED_BADGES = [
  { emoji: '🔥', label: '7-Day Streak' },
  { emoji: '💪', label: 'First PR' },
  { emoji: '⚡', label: 'Speed Run' },
  { emoji: '🥇', label: '30-Day Elite' },
  { emoji: '🧬', label: 'Macro Master' },
];

function RotatingBadge() {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const glow = useSharedValue(0.3);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withSpring(1, { damping: 10, stiffness: 80 });
    rotate.value = withRepeat(
      withSequence(withTiming(8, { duration: 1200, easing: Easing.inOut(Easing.sine) }), withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.sine) })),
      -1,
      true
    );
    glow.value = withRepeat(
      withSequence(withTiming(0.5, { duration: 1000 }), withTiming(0.2, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <View style={styles.badgeContainer}>
      <Animated.View style={[styles.badgeGlow, glowStyle]} />
      <Animated.View style={[styles.badgeWrapper, badgeStyle]}>
        <LinearGradient colors={['#FBBF24', '#F59E0B', '#D97706']} style={styles.badgeOuter} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={styles.badgeInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.badgeEmoji}>🔬</Text>
          </LinearGradient>
        </LinearGradient>
        <View style={styles.badgeLabelContainer}>
          <Text style={styles.badgeName}>CALIBRATED</Text>
          <Text style={styles.badgeSubName}>MacroPix.AI · Founding Member</Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function BadgeUnlock() {
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={24} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.phase}>LAUNCH</Text>
          <Text style={styles.title}>Achievement{'\n'}Unlocked! 🏆</Text>
        </Animated.View>

        <RotatingBadge />

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.unlockedCard}>
          <Text style={styles.unlockedLabel}>✦ JUST EARNED</Text>
          <Text style={styles.unlockedTitle}>🔬 CALIBRATED</Text>
          <Text style={styles.unlockedSubtitle}>Completed full AI calibration sequence</Text>
        </Animated.View>

        {/* Locked badges shelf */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <Text style={styles.sectionLabel}>Up Next — Keep Going</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lockedRow}>
            {LOCKED_BADGES.map((badge, i) => (
              <Animated.View key={badge.label} entering={FadeInDown.delay(700 + i * 80).duration(400)} style={styles.lockedBadge}>
                <View style={styles.lockedBadgeIcon}>
                  <Text style={styles.lockedEmoji}>{badge.emoji}</Text>
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                </View>
                <Text style={styles.lockedLabel}>{badge.label}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(900).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/onboarding/25-stay-connected'); }}
            variant="accent"
            accentColor={Colors.fuel}
          />
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.void },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  rail: { paddingTop: 56 },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, gap: Spacing.lg },
  header: { gap: 8 },
  phase: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.fuel, letterSpacing: Typography.trackingWidest },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography['3xl'], color: Colors.textPrimary, lineHeight: Typography['3xl'] * 1.2 },
  badgeContainer: { alignItems: 'center', justifyContent: 'center', height: 220 },
  badgeGlow: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#FDE68A' },
  badgeWrapper: { alignItems: 'center', gap: 12 },
  badgeOuter: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', ...Shadows.accentGlow('#F59E0B') },
  badgeInner: { width: 118, height: 118, borderRadius: 59, alignItems: 'center', justifyContent: 'center' },
  badgeEmoji: { fontSize: 52 },
  badgeLabelContainer: { alignItems: 'center', gap: 2 },
  badgeName: { fontFamily: Typography.fontDisplay, fontSize: Typography.lg, color: Colors.textPrimary, letterSpacing: Typography.trackingWide },
  badgeSubName: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted },
  unlockedCard: {
    backgroundColor: '#FFFBEB', borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1.5, borderColor: '#FDE68A', alignItems: 'center', gap: 4, ...Shadows.subtleCard,
  },
  unlockedLabel: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: '#D97706', letterSpacing: Typography.trackingWidest },
  unlockedTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography.xl, color: Colors.textPrimary },
  unlockedSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  sectionLabel: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textSecondary, letterSpacing: Typography.trackingWide, marginBottom: 12 },
  lockedRow: { gap: Spacing.sm, paddingRight: Spacing.xl },
  lockedBadge: { alignItems: 'center', gap: 6, width: 72 },
  lockedBadgeIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.borderSubtle, position: 'relative' },
  lockedEmoji: { fontSize: 24, opacity: 0.4 },
  lockOverlay: { position: 'absolute', bottom: -2, right: -2, backgroundColor: Colors.surface, borderRadius: 10, padding: 2 },
  lockIcon: { fontSize: 12 },
  lockedLabel: { fontFamily: Typography.fontBody, fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
});
