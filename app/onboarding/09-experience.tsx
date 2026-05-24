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
import { useOnboardingStore, ExperienceLevel } from '../../src/store/onboardingStore';

const LEVELS: {
  id: ExperienceLevel;
  title: string;
  subtitle: string;
  emoji: string;
  traits: string[];
}[] = [
  {
    id: 'beginner',
    title: 'New to Training',
    subtitle: 'Building the foundation',
    emoji: '🌱',
    traits: ['Learning movement patterns', 'Establishing routine', 'Focus on consistency'],
  },
  {
    id: 'intermediate',
    title: 'Building Consistency',
    subtitle: '6 months – 2 years training',
    emoji: '⚙️',
    traits: ['Solid technique', 'Tracking progress', 'Ready for periodization'],
  },
  {
    id: 'experienced',
    title: 'Experienced',
    subtitle: '2+ years serious training',
    emoji: '🔥',
    traits: ['Advanced programming', 'Optimizing variables', 'High performance focus'],
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
    scale.value = withSpring(0.96, { damping: 12 }, () => {
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
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>{level.emoji}</Text>
          <View style={styles.cardMeta}>
            <Text style={[styles.cardTitle, isSelected && { color: Colors.fuel }]}>
              {level.title}
            </Text>
            <Text style={styles.cardSubtitle}>{level.subtitle}</Text>
          </View>
          {isSelected && (
            <View style={[styles.checkBadge, { backgroundColor: Colors.fuel }]}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </View>

        <View style={styles.traitsRow}>
          {level.traits.map((trait) => (
            <View key={trait} style={styles.trait}>
              <Text style={styles.traitDot}>•</Text>
              <Text style={styles.traitText}>{trait}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Experience() {
  const { experienceLevel, setExperienceLevel } = useOnboardingStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/10-diet-approach');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={9} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 5</Text>
          <Text style={styles.title}>Training{'\n'}Experience</Text>
          <Text style={styles.subtitle}>
            Be honest — your current level shapes your entire program.
          </Text>
        </Animated.View>

        <View style={styles.list}>
          {LEVELS.map((level, i) => (
            <Animated.View
              key={level.id}
              entering={FadeInDown.delay(100 + i * 80).duration(400)}
            >
              <LevelCard
                level={level}
                isSelected={experienceLevel === level.id}
                onPress={() => setExperienceLevel(level.id)}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={handleContinue}
            variant="accent"
            accentColor={Colors.fuel}
            disabled={!experienceLevel}
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
  list: { gap: Spacing.sm },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    gap: Spacing.sm,
    ...Shadows.subtleCard,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emoji: { fontSize: 28 },
  cardMeta: { flex: 1, gap: 2 },
  cardTitle: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
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
  traitsRow: { gap: 4, paddingLeft: 44 },
  trait: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  traitDot: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.fuel,
    lineHeight: 18,
  },
  traitText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
    flex: 1,
  },
});
