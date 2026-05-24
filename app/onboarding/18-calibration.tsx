import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  FadeInDown,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius } from '../../src/theme';
import { OnboardingRail } from '../../src/components';

const STEPS = [
  { text: 'Analyzing your metabolism...', sub: 'Mifflin-St Jeor equation applied' },
  { text: 'Mapping your training capacity...', sub: 'Experience + recovery model loaded' },
  { text: 'Optimizing your macro split...', sub: `${Math.floor(Math.random() * 40) + 160}g protein target computed` },
  { text: 'Building workout architecture...', sub: 'Push/pull ratio balanced' },
  { text: 'Finalizing your protocol...', sub: 'AI calibration complete ✓' },
];

function GyroscopeRing({ radius, duration, color, delay = 0 }: { radius: number; duration: number; color: string; delay?: number }) {
  const rotate = useSharedValue(0);
  const rotateX = useSharedValue(70);

  useEffect(() => {
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1, false)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { rotateX: `${rotateX.value}deg` },
      { rotate: `${rotate.value}deg` },
    ],
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderWidth: 2,
    borderColor: color,
    position: 'absolute',
  }));

  return <Animated.View style={style} />;
}

export default function Calibration() {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const progressWidth = useSharedValue(0);
  const orbScale = useSharedValue(0.8);
  const successScale = useSharedValue(0);

  const navigate = () => router.push('/onboarding/19-protocol-reveal');

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    orbScale.value = withRepeat(
      withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.sine) }),
      -1,
      true
    );

    // Advance through steps
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setStepIdx(i);
          progressWidth.value = withTiming(((i + 1) / STEPS.length) * 100, { duration: 400 });
          if (i < STEPS.length - 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }, i * 900)
      );
    });

    // Complete
    timers.push(
      setTimeout(() => {
        setDone(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        successScale.value = withSpring(1, { damping: 10 });
        progressWidth.value = withTiming(100, { duration: 400 });
      }, STEPS.length * 900)
    );

    timers.push(setTimeout(() => runOnJS(navigate)(), STEPS.length * 900 + 1200));

    return () => timers.forEach(clearTimeout);
  }, []);

  const orbStyle = useAnimatedStyle(() => ({ transform: [{ scale: orbScale.value }] }));
  const progressStyle = useAnimatedStyle(() => ({ width: `${progressWidth.value}%` }));
  const successStyle = useAnimatedStyle(() => ({ transform: [{ scale: successScale.value }] }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={18} style={styles.rail} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.phase}>THEATER</Text>
        <Text style={styles.title}>AI Calibration</Text>
      </Animated.View>

      {/* Gyroscope visual */}
      <View style={styles.gyroscopeArea}>
        <Animated.View style={[styles.orbWrapper, orbStyle]}>
          <LinearGradient
            colors={done ? [Colors.success, '#34D399'] : [Colors.burn, Colors.power, Colors.fuel]}
            style={styles.orb}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.orbCenter}>
            <Text style={styles.orbText}>{done ? '✓' : '🧠'}</Text>
          </View>
        </Animated.View>

        <GyroscopeRing radius={64} duration={2400} color={Colors.burn} delay={0} />
        <GyroscopeRing radius={80} duration={3200} color={Colors.power} delay={200} />
        <GyroscopeRing radius={96} duration={4000} color={Colors.fuel} delay={400} />
      </View>

      {/* Step text */}
      <View style={styles.stepArea}>
        <Animated.Text key={stepIdx} entering={FadeIn.duration(300)} style={styles.stepText}>
          {STEPS[stepIdx].text}
        </Animated.Text>
        <Animated.Text key={`${stepIdx}-sub`} entering={FadeIn.duration(300)} style={styles.stepSub}>
          {STEPS[stepIdx].sub}
        </Animated.Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]}>
            <LinearGradient
              colors={[Colors.burn, Colors.power]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>
        <Text style={styles.stepCounter}>{Math.min(stepIdx + 1, STEPS.length)} / {STEPS.length}</Text>
      </View>

      {done && (
        <Animated.View style={[styles.doneCard, successStyle]}>
          <Text style={styles.doneText}>✅ Calibration complete! Loading your results...</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.void },
  rail: { paddingTop: 56 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, gap: 6 },
  phase: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.burn, letterSpacing: Typography.trackingWidest },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography['2xl'], color: Colors.textPrimary },
  gyroscopeArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orbWrapper: {
    width: 80, height: 80, borderRadius: 40,
    shadowColor: Colors.power, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12,
  },
  orb: { width: 80, height: 80, borderRadius: 40 },
  orbCenter: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  orbText: { fontSize: 28 },
  stepArea: { paddingHorizontal: Spacing['2xl'], gap: 6, alignItems: 'center', minHeight: 60 },
  stepText: { fontFamily: Typography.fontHeading, fontSize: Typography.base, color: Colors.textPrimary, textAlign: 'center' },
  stepSub: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'center' },
  progressContainer: { paddingHorizontal: Spacing.xl, paddingBottom: 60, gap: 8 },
  progressTrack: { height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  stepCounter: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'right' },
  doneCard: {
    marginHorizontal: Spacing.xl, marginBottom: 16, backgroundColor: `${Colors.success}15`,
    borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: `${Colors.success}30`,
  },
  doneText: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.success, textAlign: 'center' },
});
