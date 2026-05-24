import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withDelay,
  FadeIn, FadeInDown,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

export default function TrialConfirm() {
  const { subscriptionTier, completeOnboarding } = useOnboardingStore();
  const [phase, setPhase] = useState<'loading' | 'success'>('loading');

  const spinnerOpacity = useSharedValue(1);
  const successScale = useSharedValue(0);
  const successOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.5);
  const ringOpacity = useSharedValue(1);

  const isFree = !subscriptionTier || subscriptionTier === 'free';

  const showSuccess = () => {
    setPhase('success');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    successScale.value = withSpring(1, { damping: 10, stiffness: 120 });
    successOpacity.value = withTiming(1, { duration: 400 });
    ringScale.value = withSpring(1.6, { damping: 8 });
    ringOpacity.value = withDelay(600, withTiming(0, { duration: 500 }));
  };

  useEffect(() => {
    const timer = setTimeout(() => runOnJS(showSuccess)(), 2200);
    return () => clearTimeout(timer);
  }, []);

  const spinnerStyle = useAnimatedStyle(() => ({ opacity: spinnerOpacity.value }));
  const successStyle = useAnimatedStyle(() => ({ transform: [{ scale: successScale.value }], opacity: successOpacity.value }));
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: ringScale.value }], opacity: ringOpacity.value }));

  const handleGoToDashboard = () => {
    completeOnboarding();
    router.replace('/auth/success');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={27} style={styles.rail} />

      <View style={styles.centerArea}>
        {phase === 'loading' ? (
          <Animated.View style={[styles.loadingState, spinnerStyle]}>
            <View style={styles.spinnerWrapper}>
              <LinearGradient colors={[Colors.fuel, Colors.signal, Colors.power]} style={styles.spinner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.spinnerHole} />
              </LinearGradient>
            </View>
            <Animated.Text entering={FadeIn.delay(300).duration(400)} style={styles.loadingText}>
              {isFree ? 'Setting up your account...' : 'Activating your trial...'}
            </Animated.Text>
            <Animated.Text entering={FadeIn.delay(600).duration(400)} style={styles.loadingSubtext}>
              {isFree ? 'Preparing your dashboard' : `${subscriptionTier === 'yearly' ? 'Yearly Plan' : 'Monthly Plan'} · 3-day free trial`}
            </Animated.Text>
          </Animated.View>
        ) : (
          <View style={styles.successState}>
            {/* Pulse ring */}
            <Animated.View style={[styles.pulseRing, ringStyle]} />

            {/* Success orb */}
            <Animated.View style={[styles.successOrbWrapper, successStyle]}>
              <LinearGradient colors={[Colors.success, '#34D399']} style={styles.successOrb} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.checkmark}>✓</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(200).duration(400)} style={styles.successTitle}>
              {isFree ? "You're all set!" : "Trial Activated!"}
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(300).duration(400)} style={styles.successSubtitle}>
              {isFree
                ? 'Your personalized program is ready.'
                : `Your 3-day free trial has started.\nCancel anytime in Settings.`}
            </Animated.Text>

            {/* Summary */}
            <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>What's next</Text>
              {[
                '🏋️ Your first workout is queued',
                '🥗 Daily calorie target is set',
                '📊 Progress tracking is active',
                '🤖 AI coach is online',
              ].map((line) => (
                <Text key={line} style={styles.summaryItem}>{line}</Text>
              ))}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.ctaArea}>
              <PillButton
                label="Go to Dashboard →"
                onPress={handleGoToDashboard}
                variant="accent"
                accentColor={Colors.success}
              />
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.void },
  rail: { paddingTop: 56 },
  centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  loadingState: { alignItems: 'center', gap: Spacing.lg },
  spinnerWrapper: {
    width: 80, height: 80, borderRadius: 40,
    shadowColor: Colors.fuel, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
  },
  spinner: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  spinnerHole: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.void },
  loadingText: { fontFamily: Typography.fontHeading, fontSize: Typography.lg, color: Colors.textPrimary, textAlign: 'center' },
  loadingSubtext: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textMuted, textAlign: 'center' },
  successState: { alignItems: 'center', gap: Spacing.lg, width: '100%' },
  pulseRing: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, borderColor: Colors.success, top: -20,
  },
  successOrbWrapper: {
    width: 100, height: 100, borderRadius: 50,
    shadowColor: Colors.success, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 14,
  },
  successOrb: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  checkmark: { fontSize: 44, color: Colors.white, fontWeight: '700' },
  successTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography['2xl'], color: Colors.textPrimary, textAlign: 'center' },
  successSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: Typography.base * 1.6 },
  summaryCard: {
    width: '100%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, gap: 10, borderWidth: 1, borderColor: Colors.borderSubtle,
  },
  summaryTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: 4, letterSpacing: 0.5 },
  summaryItem: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textPrimary, lineHeight: Typography.sm * 1.6 },
  ctaArea: { width: '100%' },
});
