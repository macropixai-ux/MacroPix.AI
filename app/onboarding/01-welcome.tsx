import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { OnboardingRail } from '../../src/components';

const { width } = Dimensions.get('window');
const TRACK_WIDTH = width - 80;
const THUMB_SIZE = 52;
const MAX_SLIDE = TRACK_WIDTH - THUMB_SIZE - 8;

function SwipeLock({ onUnlock }: { onUnlock: () => void }) {
  const translateX = useSharedValue(0);
  const [unlocked, setUnlocked] = useState(false);
  const [labelOpacity, setLabelOpacity] = useState(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: (_, gs) => {
      const clamped = Math.max(0, Math.min(gs.dx, MAX_SLIDE));
      translateX.value = clamped;
      setLabelOpacity(1 - clamped / (MAX_SLIDE * 0.7));
    },
    onPanResponderRelease: (_, gs) => {
      if (gs.dx >= MAX_SLIDE * 0.75) {
        translateX.value = withSpring(MAX_SLIDE, { damping: 14 });
        setUnlocked(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => runOnJS(onUnlock)(), 300);
      } else {
        translateX.value = withSpring(0, { damping: 14 });
        setLabelOpacity(1);
      }
    },
  });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={swipeStyles.track}>
      <Animated.View style={[swipeStyles.thumb, thumbStyle]} {...panResponder.panHandlers}>
        <LinearGradient
          colors={[Colors.signal, '#34D399']}
          style={swipeStyles.thumbGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={swipeStyles.thumbArrow}>{unlocked ? '✓' : '→'}</Text>
        </LinearGradient>
      </Animated.View>
      <Text style={[swipeStyles.trackLabel, { opacity: labelOpacity }]}>
        Slide to Begin
      </Text>
    </View>
  );
}

const swipeStyles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: THUMB_SIZE + 8,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.full,
    shadowColor: Colors.signal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2,
  },
  thumbGradient: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbArrow: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: '700',
  },
  trackLabel: {
    position: 'absolute',
    alignSelf: 'center',
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textMuted,
    letterSpacing: Typography.trackingWide,
  },
});

export default function Welcome() {
  const handleUnlock = () => {
    router.push('/onboarding/02-account-gate');
  };

  const features = [
    { icon: '🧬', text: 'AI-powered calorie engine' },
    { icon: '📐', text: 'Custom macro blueprint' },
    { icon: '🏋️', text: 'Personalized workout split' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={1} style={styles.rail} />

      <View style={styles.content}>
        {/* Hero badge */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.badge}>
          <LinearGradient
            colors={[Colors.signalDim, Colors.fuelDim]}
            style={styles.badgeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.badgeText}>🔬 AI CALIBRATION</Text>
          </LinearGradient>
        </Animated.View>

        {/* Headline */}
        <Animated.Text entering={FadeInDown.delay(100).duration(600)} style={styles.headline}>
          Your body.{'\n'}
          <Text style={styles.headlineAccent}>Decoded.</Text>
        </Animated.Text>

        <Animated.Text entering={FadeInDown.delay(200).duration(600)} style={styles.subtext}>
          Answer a few questions — calibration takes{' '}
          <Text style={styles.subtextBold}>under 3 minutes.</Text>
        </Animated.Text>

        {/* Feature pills */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.featureList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Stats row */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.statsRow}>
          {[['50K+', 'Users'], ['4.8★', 'Rating'], ['98%', 'Accuracy']].map(([val, label]) => (
            <View key={label} style={styles.statItem}>
              <Text style={styles.statValue}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Swipe lock */}
      <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.swipeContainer}>
        <SwipeLock onUnlock={handleUnlock} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.void,
  },
  rail: {
    paddingTop: 56,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  badgeGradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  badgeText: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.signal,
    letterSpacing: Typography.trackingWidest,
  },
  headline: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['4xl'],
    color: Colors.textPrimary,
    lineHeight: Typography['4xl'] * 1.15,
  },
  headlineAccent: {
    color: Colors.signal,
  },
  subtext: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: Typography.base * Typography.lineHeightRelaxed,
  },
  subtextBold: {
    fontFamily: Typography.fontLabel,
    color: Colors.textPrimary,
  },
  featureList: {
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.signalDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    fontSize: 16,
  },
  featureText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtleCard,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.xl,
    color: Colors.signal,
  },
  statLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  swipeContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
    alignItems: 'center',
  },
});
