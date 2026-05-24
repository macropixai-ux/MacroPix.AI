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
import { useOnboardingStore, DietApproach } from '../../src/store/onboardingStore';

const DIETS: {
  id: DietApproach;
  title: string;
  subtitle: string;
  emoji: string;
  macroHint: string;
  tag?: string;
}[] = [
  {
    id: 'balanced',
    title: 'Standard Balanced',
    subtitle: 'Moderate carbs, protein, fats',
    emoji: '⚖️',
    macroHint: '30P / 45C / 25F',
    tag: 'RECOMMENDED',
  },
  {
    id: 'high_protein',
    title: 'High Protein',
    subtitle: 'Maximise muscle protein synthesis',
    emoji: '🥩',
    macroHint: '40P / 40C / 20F',
  },
  {
    id: 'mediterranean',
    title: 'Mediterranean',
    subtitle: 'Heart-healthy fats & whole foods',
    emoji: '🫒',
    macroHint: '25P / 45C / 30F',
  },
  {
    id: 'keto',
    title: 'Keto / Low Carb',
    subtitle: 'Fat-adapted metabolic state',
    emoji: '🥑',
    macroHint: '30P / 5C / 65F',
  },
  {
    id: 'paleo',
    title: 'Paleo',
    subtitle: 'Whole foods, no processed grains',
    emoji: '🍖',
    macroHint: '35P / 30C / 35F',
  },
  {
    id: 'flexitarian',
    title: 'Flexitarian',
    subtitle: 'Mostly plant, occasional meat',
    emoji: '🥗',
    macroHint: '28P / 47C / 25F',
  },
];

function DietCard({
  diet,
  isSelected,
  onPress,
}: {
  diet: (typeof DIETS)[0];
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
        <Text style={styles.emoji}>{diet.emoji}</Text>
        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, isSelected && { color: Colors.fuel }]}>
              {diet.title}
            </Text>
            {diet.tag && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{diet.tag}</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardSubtitle}>{diet.subtitle}</Text>
          <Text style={[styles.macroHint, isSelected && { color: Colors.fuel }]}>
            {diet.macroHint}
          </Text>
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

export default function DietApproachScreen() {
  const { dietApproach, setDietApproach } = useOnboardingStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/11-meal-timing');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={10} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 6</Text>
          <Text style={styles.title}>Diet{'\n'}Approach</Text>
          <Text style={styles.subtitle}>
            Choose your nutritional framework. We'll compute your exact macro targets.
          </Text>
        </Animated.View>

        <View style={styles.list}>
          {DIETS.map((diet, i) => (
            <Animated.View
              key={diet.id}
              entering={FadeInDown.delay(80 + i * 60).duration(400)}
            >
              <DietCard
                diet={diet}
                isSelected={dietApproach === diet.id}
                onPress={() => setDietApproach(diet.id)}
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
            disabled={!dietApproach}
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
  emoji: { fontSize: 26, width: 36, textAlign: 'center' },
  cardText: { flex: 1, gap: 2 },
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
  tag: {
    backgroundColor: Colors.signalDim,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  tagText: {
    fontFamily: Typography.fontLabel,
    fontSize: 9,
    color: Colors.signal,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  macroHint: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.3,
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
