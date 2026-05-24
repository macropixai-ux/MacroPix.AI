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
import { useOnboardingStore, ActivityLevel } from '../../src/store/onboardingStore';

const LEVELS: {
  id: ActivityLevel;
  title: string;
  subtitle: string;
  emoji: string;
  multiplier: string;
  examples: string;
}[] = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    subtitle: 'Desk job, minimal movement',
    emoji: '💻',
    multiplier: '×1.2 TDEE',
    examples: 'Office worker, developer',
  },
  {
    id: 'lightly_active',
    title: 'Lightly Active',
    subtitle: 'Some standing or light walking',
    emoji: '🚶',
    multiplier: '×1.375 TDEE',
    examples: 'Teacher, light retail',
  },
  {
    id: 'moderately_active',
    title: 'Moderately Active',
    subtitle: 'On your feet, regular movement',
    emoji: '🏃',
    multiplier: '×1.55 TDEE',
    examples: 'Nurse, active retail',
  },
  {
    id: 'very_active',
    title: 'Very Active',
    subtitle: 'Physical labor or intense training',
    emoji: '⚡',
    multiplier: '×1.725 TDEE',
    examples: 'Construction, athlete',
  },
];

function LevelCard({
  level,
  isSelected,
  onPress,
}: {
  level: (typeof LEVELS)[0];
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
          styles.card,
          isSelected && {
            borderColor: Colors.fuel,
            borderWidth: 2,
            backgroundColor: Colors.fuelDim,
          },
        ]}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.emoji}>{level.emoji}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, isSelected && { color: Colors.fuel }]}>
              {level.title}
            </Text>
            <View
              style={[
                styles.multiplierBadge,
                isSelected && { backgroundColor: Colors.fuel },
              ]}
            >
              <Text
                style={[
                  styles.multiplierText,
                  isSelected && { color: Colors.white },
                ]}
              >
                {level.multiplier}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>{level.subtitle}</Text>
          <Text style={styles.examples}>{level.examples}</Text>
        </View>
        {isSelected && (
          <View style={[styles.checkBadge, { backgroundColor: Colors.fuel }]}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ActivityLevelScreen() {
  const { activityLevel, setActivityLevel } = useOnboardingStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/13-somatotype');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={12} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 8</Text>
          <Text style={styles.title}>Daily Activity{'\n'}Level</Text>
          <Text style={styles.subtitle}>
            Outside of training — how active is your typical day?
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(400)}
          style={styles.infoCard}
        >
          <Text style={styles.infoText}>
            💡 This sets your TDEE multiplier — the biggest lever in your calorie calculation.
          </Text>
        </Animated.View>

        <View style={styles.list}>
          {LEVELS.map((level, i) => (
            <Animated.View
              key={level.id}
              entering={FadeInDown.delay(160 + i * 60).duration(400)}
            >
              <LevelCard
                level={level}
                isSelected={activityLevel === level.id}
                onPress={() => setActivityLevel(level.id)}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={handleContinue}
            variant="accent"
            accentColor={Colors.fuel}
            disabled={!activityLevel}
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
  infoCard: {
    backgroundColor: Colors.fuelDim,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.fuel}20`,
  },
  infoText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sm * 1.6,
  },
  list: { gap: Spacing.xs },
  card: {
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
  cardLeft: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
  },
  emoji: { fontSize: 22 },
  cardBody: { flex: 1, gap: 2 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  multiplierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.fuelDim,
  },
  multiplierText: {
    fontFamily: Typography.fontLabel,
    fontSize: 10,
    color: Colors.fuel,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  examples: {
    fontFamily: Typography.fontBody,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
