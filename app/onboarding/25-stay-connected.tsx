import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

export default function StayConnected() {
  const { name, setNotificationsEnabled } = useOnboardingStore();

  const handleEnable = async () => {
    try {
      // Mock permission — in production, call Notifications.requestPermissionsAsync()
      setNotificationsEnabled(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
    router.push('/onboarding/26-paywall');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/26-paywall');
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={25} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.phase}>LAUNCH</Text>
          <Text style={styles.title}>Stay{'\n'}Connected</Text>
          <Text style={styles.subtitle}>Your morning coaching brief keeps you on track every single day.</Text>
        </Animated.View>

        {/* Mock iOS notification */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.notifCard}>
          <View style={styles.notifHeader}>
            <View style={styles.notifAppIcon}>
              <Text style={styles.notifAppEmoji}>🔬</Text>
            </View>
            <View style={styles.notifMeta}>
              <Text style={styles.notifAppName}>MacroPix.AI</Text>
              <Text style={styles.notifTime}>now</Text>
            </View>
          </View>
          <Text style={styles.notifTitle}>Good morning, {name || 'Athlete'}! 💪</Text>
          <Text style={styles.notifBody}>
            Today's mission: {'\n'}
            • Push session · 4 exercises · 60 min{'\n'}
            • Target: {2100} kcal · 165g protein{'\n'}
            • You're 2 days from your weekly streak 🔥
          </Text>
          <View style={styles.notifActions}>
            <View style={styles.notifAction}>
              <Text style={styles.notifActionText}>Open Coach</Text>
            </View>
            <View style={[styles.notifAction, styles.notifActionPrimary]}>
              <Text style={[styles.notifActionText, styles.notifActionTextPrimary]}>Start Day</Text>
            </View>
          </View>
        </Animated.View>

        {/* Benefits list */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.benefitsList}>
          {[
            { icon: '⏰', title: 'Daily 7am briefing', subtitle: 'Custom summary of today\'s plan' },
            { icon: '🏃', title: 'Workout reminders', subtitle: 'Never miss a scheduled session' },
            { icon: '📊', title: 'Weekly progress reports', subtitle: 'Trend analysis delivered to you' },
          ].map((b) => (
            <View key={b.title} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitEmoji}>{b.icon}</Text>
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitSubtitle}>{b.subtitle}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.buttons}>
          <PillButton
            label="Enable Notifications →"
            onPress={handleEnable}
            variant="accent"
            accentColor={Colors.fuel}
          />
          <PillButton
            label="Maybe Later"
            onPress={handleSkip}
            variant="ghost"
            accentColor={Colors.textMuted}
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
  subtitle: { fontFamily: Typography.fontBody, fontSize: Typography.base, color: Colors.textSecondary },
  notifCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: Spacing.lg, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderSubtle,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 8,
  },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifAppIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.signal, alignItems: 'center', justifyContent: 'center' },
  notifAppEmoji: { fontSize: 16 },
  notifMeta: { flex: 1 },
  notifAppName: { fontFamily: Typography.fontHeading, fontSize: Typography.xs, color: Colors.textPrimary },
  notifTime: { fontFamily: Typography.fontBody, fontSize: 10, color: Colors.textMuted },
  notifTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textPrimary },
  notifBody: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textSecondary, lineHeight: Typography.xs * 1.7 },
  notifActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
  notifAction: { flex: 1, height: 36, borderRadius: Radius.full, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  notifActionPrimary: { backgroundColor: Colors.fuel },
  notifActionText: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.textSecondary },
  notifActionTextPrimary: { color: Colors.white },
  benefitsList: { gap: Spacing.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  benefitIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.fuelDim, alignItems: 'center', justifyContent: 'center' },
  benefitEmoji: { fontSize: 22 },
  benefitText: { flex: 1, gap: 2 },
  benefitTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textPrimary },
  benefitSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted },
  buttons: { gap: Spacing.sm },
});
