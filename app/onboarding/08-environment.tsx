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
import { useOnboardingStore, TrainingEnv } from '../../src/store/onboardingStore';

const ENVS: {
  id: TrainingEnv;
  title: string;
  subtitle: string;
  emoji: string;
  detail: string;
}[] = [
  {
    id: 'gym',
    title: 'Gym',
    subtitle: 'Full equipment access',
    emoji: '🏋️',
    detail: 'Barbells, machines, cables',
  },
  {
    id: 'home',
    title: 'Home',
    subtitle: 'Bodyweight & dumbbells',
    emoji: '🏠',
    detail: 'No commute needed',
  },
  {
    id: 'outdoor',
    title: 'Outdoor',
    subtitle: 'Running & calisthenics',
    emoji: '🌿',
    detail: 'Parks, trails, open space',
  },
  {
    id: 'mixed',
    title: 'Mixed',
    subtitle: 'Flexible setup',
    emoji: '⚡',
    detail: 'Best of all worlds',
  },
];

function EnvCard({
  env,
  isSelected,
  onPress,
}: {
  env: (typeof ENVS)[0];
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
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View
          style={[
            styles.card,
            isSelected && {
              borderColor: Colors.fuel,
              borderWidth: 2,
              backgroundColor: Colors.fuelDim,
            },
          ]}
        >
          <Text style={styles.emoji}>{env.emoji}</Text>
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, isSelected && { color: Colors.fuel }]}>
              {env.title}
            </Text>
            <Text style={styles.cardSubtitle}>{env.subtitle}</Text>
            <Text style={styles.cardDetail}>{env.detail}</Text>
          </View>
          {isSelected && (
            <View style={[styles.checkBadge, { backgroundColor: Colors.fuel }]}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Environment() {
  const { trainingEnv, setTrainingEnv } = useOnboardingStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/09-experience');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={8} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 4</Text>
          <Text style={styles.title}>Training{'\n'}Environment</Text>
          <Text style={styles.subtitle}>Where do you plan to work out most?</Text>
        </Animated.View>

        <View style={styles.list}>
          {ENVS.map((env, i) => (
            <Animated.View
              key={env.id}
              entering={FadeInDown.delay(100 + i * 60).duration(400)}
            >
              <EnvCard
                env={env}
                isSelected={trainingEnv === env.id}
                onPress={() => setTrainingEnv(env.id)}
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
            disabled={!trainingEnv}
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
  cardWrapper: {},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    ...Shadows.subtleCard,
  },
  emoji: { fontSize: 32 },
  cardText: { flex: 1, gap: 2 },
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
  cardDetail: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
