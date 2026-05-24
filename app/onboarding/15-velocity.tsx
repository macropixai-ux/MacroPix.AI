import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore, ChangeVelocity } from '../../src/store/onboardingStore';

const VELOCITIES: {
  id: ChangeVelocity;
  title: string;
  subtitle: string;
  emoji: string;
  rate: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'steady',
    title: 'Steady',
    subtitle: 'Sustainable & gradual',
    emoji: '🦥',
    rate: '~0.25 kg/week',
    description: 'Minimal muscle loss. Best for maintaining strength while transforming.',
    color: Colors.signal,
  },
  {
    id: 'balanced',
    title: 'Balanced',
    subtitle: 'Best of both worlds',
    emoji: '🐇',
    rate: '~0.5 kg/week',
    description: 'The evidence-backed sweet spot for most people.',
    color: Colors.fuel,
  },
  {
    id: 'intensive',
    title: 'Intensive',
    subtitle: 'Fast results, high discipline',
    emoji: '🐆',
    rate: '~0.75 kg/week',
    description: 'Maximum speed. Requires strict adherence and recovery.',
    color: Colors.burn,
  },
];

function BouncingEmoji({ emoji, isSelected }: { emoji: string; isSelected: boolean }) {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (isSelected) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      );
    } else {
      translateY.value = withTiming(0, { duration: 200 });
    }
  }, [isSelected]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.Text style={[styles.velocityEmoji, style]}>{emoji}</Animated.Text>
  );
}

function VelocityCard({
  velocity,
  isSelected,
  onPress,
}: {
  velocity: (typeof VELOCITIES)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.96, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 12 });
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
          isSelected && { borderColor: velocity.color, borderWidth: 2, backgroundColor: `${velocity.color}08` },
        ]}
      >
        <View style={styles.cardLeft}>
          <BouncingEmoji emoji={velocity.emoji} isSelected={isSelected} />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, isSelected && { color: velocity.color }]}>
              {velocity.title}
            </Text>
            <View style={[styles.rateBadge, isSelected && { backgroundColor: velocity.color }]}>
              <Text style={[styles.rateText, isSelected && { color: Colors.white }]}>
                {velocity.rate}
              </Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>{velocity.subtitle}</Text>
          {isSelected && (
            <Animated.Text entering={FadeInDown.duration(200)} style={styles.cardDescription}>
              {velocity.description}
            </Animated.Text>
          )}
        </View>
        {isSelected && (
          <View style={[styles.checkBadge, { backgroundColor: velocity.color }]}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function VelocityScreen() {
  const { changeVelocity, setChangeVelocity } = useOnboardingStore();

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={15} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>BLUEPRINT · STEP 3</Text>
          <Text style={styles.title}>Progress{'\n'}Velocity</Text>
          <Text style={styles.subtitle}>How fast do you want to transform? Choose your pace.</Text>
        </Animated.View>

        <View style={styles.list}>
          {VELOCITIES.map((v, i) => (
            <Animated.View key={v.id} entering={FadeInDown.delay(100 + i * 80).duration(400)}>
              <VelocityCard
                velocity={v}
                isSelected={changeVelocity === v.id}
                onPress={() => setChangeVelocity(v.id)}
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/onboarding/16-target-lock'); }}
            variant="accent"
            accentColor={Colors.power}
            disabled={!changeVelocity}
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
  stepLabel: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.power, letterSpacing: Typography.trackingWidest },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography['3xl'], color: Colors.textPrimary, lineHeight: Typography['3xl'] * 1.2 },
  subtitle: { fontFamily: Typography.fontBody, fontSize: Typography.base, color: Colors.textSecondary },
  list: { gap: Spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1.5, borderColor: Colors.borderSubtle, ...Shadows.subtleCard,
  },
  cardLeft: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  velocityEmoji: { fontSize: 32 },
  cardBody: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.base, color: Colors.textPrimary },
  rateBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.powerDim },
  rateText: { fontFamily: Typography.fontLabel, fontSize: 10, color: Colors.power },
  cardSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  cardDescription: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted, lineHeight: Typography.xs * 1.6, marginTop: 2 },
  checkBadge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
});
