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
import { PillButton, SegmentedControl, OnboardingRail } from '../../src/components';
import { useOnboardingStore, TrainingDay } from '../../src/store/onboardingStore';

const DAYS: { id: TrainingDay; short: string }[] = [
  { id: 'Mon', short: 'M' },
  { id: 'Tue', short: 'T' },
  { id: 'Wed', short: 'W' },
  { id: 'Thu', short: 'T' },
  { id: 'Fri', short: 'F' },
  { id: 'Sat', short: 'S' },
  { id: 'Sun', short: 'S' },
];

const DURATIONS: (30 | 45 | 60 | 90)[] = [30, 45, 60, 90];

function DayCircle({
  day,
  isSelected,
  onToggle,
}: {
  day: { id: TrainingDay; short: string };
  isSelected: boolean;
  onToggle: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.85, { damping: 8 }, () => {
      scale.value = withSpring(1.08, { damping: 10 }, () => {
        scale.value = withSpring(1, { damping: 12 });
      });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          styles.dayCircle,
          isSelected && { backgroundColor: Colors.fuel, borderColor: Colors.fuel },
        ]}
      >
        <Text
          style={[styles.dayShort, isSelected && { color: Colors.white, fontFamily: Typography.fontHeading }]}
        >
          {day.short}
        </Text>
        <Text
          style={[styles.dayFull, isSelected && { color: 'rgba(255,255,255,0.7)' }]}
        >
          {day.id.slice(0, 3)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function TrainingRhythm() {
  const { trainingDays, sessionDuration, toggleTrainingDay, setSessionDuration } =
    useOnboardingStore();

  const durationIdx = DURATIONS.indexOf(sessionDuration);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/08-environment');
  };

  const daysCount = trainingDays.length;
  const totalWeeklyMins = daysCount * sessionDuration;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={7} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 3</Text>
          <Text style={styles.title}>Training{'\n'}Rhythm</Text>
          <Text style={styles.subtitle}>When can you train? Pick your days and session length.</Text>
        </Animated.View>

        {/* Days selector */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
          <Text style={styles.cardLabel}>Training Days</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => (
              <DayCircle
                key={day.id}
                day={day}
                isSelected={trainingDays.includes(day.id)}
                onToggle={() => toggleTrainingDay(day.id)}
              />
            ))}
          </View>
        </Animated.View>

        {/* Session duration */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.card}>
          <Text style={styles.cardLabel}>Session Duration</Text>
          <SegmentedControl
            options={DURATIONS.map((d) => `${d}m`)}
            selectedIndex={durationIdx >= 0 ? durationIdx : 2}
            onChange={(i) => setSessionDuration(DURATIONS[i])}
            accentColor={Colors.fuel}
          />
        </Animated.View>

        {/* Summary */}
        {daysCount > 0 && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.fuel }]}>{daysCount}</Text>
                <Text style={styles.summaryItemLabel}>days/week</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.fuel }]}>{sessionDuration}m</Text>
                <Text style={styles.summaryItemLabel}>per session</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.fuel }]}>{totalWeeklyMins}m</Text>
                <Text style={styles.summaryItemLabel}>per week</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={handleContinue}
            variant="accent"
            accentColor={Colors.fuel}
            disabled={trainingDays.length === 0}
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
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    ...Shadows.subtleCard,
  },
  cardLabel: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    letterSpacing: Typography.trackingWide,
    textTransform: 'uppercase',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 40,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayShort: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  dayFull: {
    fontFamily: Typography.fontBody,
    fontSize: 9,
    color: Colors.textMuted,
  },
  summaryCard: {
    backgroundColor: Colors.fuelDim,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.fuel}25`,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['2xl'],
  },
  summaryItemLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: `${Colors.fuel}30`,
  },
});
