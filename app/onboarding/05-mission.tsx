import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore, Goal } from '../../src/store/onboardingStore';

const GOALS: {
  id: Goal;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: [string, string];
  tag: string;
}[] = [
  {
    id: 'build_muscle',
    title: 'Build Muscle',
    subtitle: 'Hypertrophy & Strength',
    emoji: '💪',
    gradient: ['#6366F1', '#8B5CF6'],
    tag: 'POPULAR',
  },
  {
    id: 'lose_fat',
    title: 'Lose Fat',
    subtitle: 'Lean out, stay strong',
    emoji: '🔥',
    gradient: [Colors.burn, '#F97316'],
    tag: '',
  },
  {
    id: 'recompose',
    title: 'Recompose',
    subtitle: 'Lose fat, gain muscle',
    emoji: '⚡',
    gradient: [Colors.signal, Colors.fuel],
    tag: 'ADVANCED',
  },
  {
    id: 'performance',
    title: 'Performance',
    subtitle: 'Speed & Endurance',
    emoji: '🏆',
    gradient: [Colors.fuel, '#06B6D4'],
    tag: '',
  },
];

function GoalCard({
  goal,
  isSelected,
  onPress,
}: {
  goal: (typeof GOALS)[0];
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
    <Animated.View style={[styles.cardWrapper, animStyle]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
        {isSelected ? (
          <LinearGradient
            colors={goal.gradient}
            style={styles.cardInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <CardContent goal={goal} isSelected />
          </LinearGradient>
        ) : (
          <View style={[styles.cardInner, styles.cardUnselected]}>
            <CardContent goal={goal} isSelected={false} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function CardContent({
  goal,
  isSelected,
}: {
  goal: (typeof GOALS)[0];
  isSelected: boolean;
}) {
  return (
    <>
      <View style={styles.cardTop}>
        <Text style={styles.cardEmoji}>{goal.emoji}</Text>
        {goal.tag ? (
          <View
            style={[
              styles.cardTag,
              isSelected ? styles.cardTagSelected : styles.cardTagDefault,
            ]}
          >
            <Text
              style={[
                styles.cardTagText,
                isSelected && { color: Colors.white },
              ]}
            >
              {goal.tag}
            </Text>
          </View>
        ) : null}
      </View>
      <Text
        style={[styles.cardTitle, isSelected && { color: Colors.white }]}
      >
        {goal.title}
      </Text>
      <Text
        style={[styles.cardSubtitle, isSelected && { color: 'rgba(255,255,255,0.8)' }]}
      >
        {goal.subtitle}
      </Text>
      {isSelected && (
        <View style={styles.selectedCheck}>
          <Text style={styles.selectedCheckText}>✓</Text>
        </View>
      )}
    </>
  );
}

export default function Mission() {
  const { goal, setGoal } = useOnboardingStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/06-focus-zones');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={5} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 1</Text>
          <Text style={styles.title}>Primary{'\n'}Mission</Text>
          <Text style={styles.subtitle}>Choose your #1 objective. We'll tailor everything to it.</Text>
        </Animated.View>

        <View style={styles.grid}>
          {GOALS.map((g, i) => (
            <Animated.View
              key={g.id}
              entering={FadeInDown.delay(100 + i * 80).duration(400)}
              style={styles.gridItem}
            >
              <GoalCard
                goal={g}
                isSelected={goal === g.id}
                onPress={() => setGoal(g.id)}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <PillButton
            label="Lock In Mission →"
            onPress={handleContinue}
            variant="accent"
            accentColor={Colors.fuel}
            disabled={!goal}
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
  grid: { gap: Spacing.sm },
  gridItem: {},
  cardWrapper: {},
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.subtleCard,
  },
  cardInner: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    minHeight: 110,
    gap: 4,
    position: 'relative',
  },
  cardUnselected: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardEmoji: { fontSize: 28 },
  cardTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  cardTagDefault: { backgroundColor: Colors.signalDim },
  cardTagSelected: { backgroundColor: 'rgba(255,255,255,0.25)' },
  cardTagText: {
    fontFamily: Typography.fontLabel,
    fontSize: 10,
    color: Colors.signal,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.xl,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  selectedCheck: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
