import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { OnboardingRail } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

const { width, height } = Dimensions.get('window');

const DATA_CARDS = [
  { label: 'Goal', icon: '🎯', getValue: (s: any) => s.goal?.replace('_', ' ') ?? 'Build Muscle' },
  { label: 'Weight', icon: '⚖️', getValue: (s: any) => `${s.weight} kg` },
  { label: 'Training Days', icon: '📅', getValue: (s: any) => `${s.trainingDays.length}x/week` },
  { label: 'Diet', icon: '🥗', getValue: (s: any) => s.dietApproach?.replace('_', ' ') ?? 'Balanced' },
  { label: 'Velocity', icon: '⚡', getValue: (s: any) => s.changeVelocity ?? 'Balanced' },
  { label: 'Somatotype', icon: '🧬', getValue: (s: any) => s.somatotype ?? 'Mesomorph' },
];

function FloatingCard({ card, index, collapsed }: { card: typeof DATA_CARDS[0]; index: number; collapsed: boolean }) {
  const store = useOnboardingStore();
  const translateX = useSharedValue((index % 2 === 0 ? -1 : 1) * (60 + index * 20));
  const translateY = useSharedValue(-120 + index * 40);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    const delay = index * 180;
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
    translateX.value = withDelay(delay, withSpring(0, { damping: 14 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 14 }));
  }, []);

  useEffect(() => {
    if (collapsed) {
      const delay = index * 60;
      translateX.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.inOut(Easing.cubic) }));
      translateY.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.inOut(Easing.cubic) }));
      scale.value = withDelay(delay, withTiming(0, { duration: 400 }));
      opacity.value = withDelay(delay, withTiming(0, { duration: 400 }));
    }
  }, [collapsed]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatCard, style]}>
      <Text style={styles.floatIcon}>{card.icon}</Text>
      <View>
        <Text style={styles.floatLabel}>{card.label}</Text>
        <Text style={styles.floatValue}>{card.getValue(store)}</Text>
      </View>
    </Animated.View>
  );
}

export default function CommitmentBridge() {
  const orbScale = useSharedValue(0.3);
  const orbOpacity = useSharedValue(0);
  const orbSpin = useSharedValue(0);
  const [collapsed, setCollapsed] = React.useState(false);
  const [statusIdx, setStatusIdx] = React.useState(0);

  const STATUS_MESSAGES = [
    'Assembling your data...',
    'Decoding somatotype...',
    'Calculating TDEE...',
    'Mapping training capacity...',
    'Building your protocol...',
  ];

  const navigate = () => router.push('/onboarding/18-calibration');

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Start collapse after cards appear
    const collapseTimer = setTimeout(() => {
      setCollapsed(true);
      orbScale.value = withSpring(1.2, { damping: 10 });
      orbOpacity.value = withTiming(1, { duration: 600 });

      // Spin
      orbSpin.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    }, DATA_CARDS.length * 180 + 600);

    // Status message cycling
    const msgTimers: ReturnType<typeof setTimeout>[] = [];
    STATUS_MESSAGES.forEach((_, i) => {
      msgTimers.push(setTimeout(() => setStatusIdx(i), i * 500 + 1200));
    });

    // Navigate forward
    const navTimer = setTimeout(() => runOnJS(navigate)(), 4200);

    return () => {
      clearTimeout(collapseTimer);
      clearTimeout(navTimer);
      msgTimers.forEach(clearTimeout);
    };
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
    opacity: orbOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={17} style={styles.rail} />

      <Animated.View entering={FadeIn.duration(400)} style={styles.titleArea}>
        <Text style={styles.phase}>THEATER</Text>
        <Text style={styles.title}>Assembling your{'\n'}blueprint...</Text>
      </Animated.View>

      {/* Floating data cards */}
      <View style={styles.cardsArea}>
        {DATA_CARDS.map((card, i) => (
          <FloatingCard key={card.label} card={card} index={i} collapsed={collapsed} />
        ))}

        {/* Central orb */}
        <Animated.View style={[styles.orbWrapper, orbStyle]}>
          <LinearGradient
            colors={[Colors.burn, Colors.power, Colors.fuel]}
            style={styles.orb}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.orbInner} />
        </Animated.View>
      </View>

      {/* Status text */}
      {collapsed && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.statusArea}>
          <Text style={styles.statusText}>{STATUS_MESSAGES[statusIdx]}</Text>
          <View style={styles.statusDots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, i <= statusIdx % 3 && styles.dotActive]} />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.void },
  rail: { paddingTop: 56 },
  titleArea: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, gap: 6 },
  phase: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.burn, letterSpacing: Typography.trackingWidest },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography['2xl'], color: Colors.textPrimary, lineHeight: Typography['2xl'] * 1.2 },
  cardsArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  floatCard: {
    position: 'absolute',
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.subtleCard,
  },
  floatIcon: { fontSize: 22 },
  floatLabel: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted },
  floatValue: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textPrimary, textTransform: 'capitalize' },
  orbWrapper: {
    width: 90, height: 90, borderRadius: 45,
    shadowColor: Colors.burn, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 14,
  },
  orb: { width: 90, height: 90, borderRadius: 45 },
  orbInner: { position: 'absolute', width: 36, height: 36, borderRadius: 18, top: 27, left: 27, backgroundColor: 'rgba(255,255,255,0.25)' },
  statusArea: { paddingHorizontal: Spacing.xl, paddingBottom: 60, alignItems: 'center', gap: 12 },
  statusText: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  statusDots: { flexDirection: 'row', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.borderSubtle },
  dotActive: { backgroundColor: Colors.burn },
});
