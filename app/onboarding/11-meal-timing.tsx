import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore, MealTiming } from '../../src/store/onboardingStore';

const TIMINGS: {
  id: MealTiming;
  title: string;
  subtitle: string;
  emoji: string;
  window: string;
}[] = [
  {
    id: 'standard',
    title: 'Standard',
    subtitle: '3–5 balanced meals per day',
    emoji: '🍽️',
    window: 'Every 3–4 hours',
  },
  {
    id: 'intermittent_fasting',
    title: 'Intermittent Fasting',
    subtitle: 'Controlled eating window',
    emoji: '⏱️',
    window: '16:8 or 18:6 protocol',
  },
  {
    id: 'omad',
    title: 'OMAD',
    subtitle: 'One meal a day — maximum focus',
    emoji: '🎯',
    window: '23:1 protocol',
  },
  {
    id: 'calorie_cycling',
    title: 'Calorie Cycling',
    subtitle: 'High/low days synced to training',
    emoji: '📊',
    window: 'Training vs. rest days',
  },
  {
    id: 'intuitive',
    title: 'Intuitive',
    subtitle: 'Eat when hungry, stop when full',
    emoji: '🌊',
    window: 'No strict schedule',
  },
];

function TimingRow({
  timing,
  isSelected,
  onPress,
}: {
  timing: (typeof TIMINGS)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 12 }, () => {
      scale.value = withSpring(1, { damping: 14 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={[
          styles.row,
          isSelected && {
            borderColor: Colors.fuel,
            borderWidth: 2,
            backgroundColor: Colors.fuelDim,
          },
        ]}
      >
        <View style={[styles.emojiBox, isSelected && { backgroundColor: Colors.fuel }]}>
          <Text style={styles.emoji}>{timing.emoji}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowTitle, isSelected && { color: Colors.fuel }]}>
            {timing.title}
          </Text>
          <Text style={styles.rowSubtitle}>{timing.subtitle}</Text>
          <Text style={styles.rowWindow}>{timing.window}</Text>
        </View>
        <View
          style={[
            styles.radio,
            isSelected && { borderColor: Colors.fuel, backgroundColor: Colors.fuel },
          ]}
        >
          {isSelected && <View style={styles.radioDot} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MealTimingScreen() {
  const { mealTiming, setMealTiming } = useOnboardingStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/12-activity-level');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={11} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 7</Text>
          <Text style={styles.title}>Meal{'\n'}Timing</Text>
          <Text style={styles.subtitle}>
            Your eating window affects how we structure your daily nutrition.
          </Text>
        </Animated.View>

        <View style={styles.list}>
          {TIMINGS.map((timing, i) => (
            <Animated.View
              key={timing.id}
              entering={FadeInDown.delay(80 + i * 60).duration(400)}
            >
              <TimingRow
                timing={timing}
                isSelected={mealTiming === timing.id}
                onPress={() => setMealTiming(timing.id)}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(450).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={handleContinue}
            variant="accent"
            accentColor={Colors.fuel}
            disabled={!mealTiming}
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
  stepLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.fuel,
    letterSpacing: Typography.trackingWidest,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['3xl'],
    color: Colors.textPrimary,
    lineHeight: Typography['3xl'] * 1.2,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: Typography.base * 1.6,
  },
  list: { gap: Spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    ...Shadows.subtleCard,
  },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  rowSubtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  rowWindow: {
    fontFamily: Typography.fontLabel,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.white,
  },
});
