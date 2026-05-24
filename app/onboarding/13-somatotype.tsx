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
import { useOnboardingStore, Somatotype } from '../../src/store/onboardingStore';

const TYPES: {
  id: Somatotype;
  title: string;
  subtitle: string;
  emoji: string;
  traits: string[];
  gradient: [string, string];
}[] = [
  {
    id: 'ectomorph',
    title: 'Lean',
    subtitle: 'Fast metabolism, hard gainer',
    emoji: '⚡',
    traits: ['Naturally thin frame', 'Fast metabolism', 'Hard to build mass'],
    gradient: ['#6366F1', '#818CF8'],
  },
  {
    id: 'mesomorph',
    title: 'Athletic',
    subtitle: 'Gains muscle easily, balanced',
    emoji: '💪',
    traits: ['Naturally muscular', 'Responds fast to training', 'Balanced fat distribution'],
    gradient: [Colors.signal, '#34D399'],
  },
  {
    id: 'endomorph',
    title: 'Sturdy',
    subtitle: 'Solid build, gains weight easily',
    emoji: '🧱',
    traits: ['Broad, stocky build', 'High strength potential', 'Gains fat more readily'],
    gradient: [Colors.power, '#A78BFA'],
  },
];

function TypeCard({
  type,
  isSelected,
  onPress,
}: {
  type: (typeof TYPES)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1.02, { damping: 10 }, () => {
        scale.value = withSpring(1, { damping: 12 });
      });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        {isSelected ? (
          <LinearGradient
            colors={type.gradient}
            style={[styles.card, styles.cardSelected]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <CardBody type={type} isSelected />
          </LinearGradient>
        ) : (
          <View style={styles.card}>
            <CardBody type={type} isSelected={false} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function CardBody({ type, isSelected }: { type: (typeof TYPES)[0]; isSelected: boolean }) {
  return (
    <>
      <View style={styles.cardTop}>
        <Text style={styles.cardEmoji}>{type.emoji}</Text>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
      </View>
      <Text style={[styles.cardTitle, isSelected && { color: Colors.white }]}>{type.title}</Text>
      <Text style={[styles.cardSubtitle, isSelected && { color: 'rgba(255,255,255,0.8)' }]}>
        {type.subtitle}
      </Text>
      <View style={styles.traitList}>
        {type.traits.map((t) => (
          <View key={t} style={styles.trait}>
            <Text style={[styles.traitDot, isSelected && { color: 'rgba(255,255,255,0.6)' }]}>•</Text>
            <Text style={[styles.traitText, isSelected && { color: 'rgba(255,255,255,0.85)' }]}>{t}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

export default function SomatotypeScreen() {
  const { somatotype, setSomatotype } = useOnboardingStore();

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={13} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>BLUEPRINT · STEP 1</Text>
          <Text style={styles.title}>Body{'\n'}Type</Text>
          <Text style={styles.subtitle}>Your natural tendencies shape your program structure.</Text>
        </Animated.View>
        <View style={styles.list}>
          {TYPES.map((type, i) => (
            <Animated.View key={type.id} entering={FadeInDown.delay(100 + i * 80).duration(400)}>
              <TypeCard type={type} isSelected={somatotype === type.id} onPress={() => setSomatotype(type.id)} />
            </Animated.View>
          ))}
        </View>
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/onboarding/14-injury-check'); }}
            variant="accent"
            accentColor={Colors.power}
            disabled={!somatotype}
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
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1.5, borderColor: Colors.borderSubtle, gap: 6, ...Shadows.subtleCard,
  },
  cardSelected: { borderWidth: 0 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardEmoji: { fontSize: 30 },
  checkBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  checkText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
  cardTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography.xl, color: Colors.textPrimary },
  cardSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  traitList: { gap: 3, marginTop: 4 },
  trait: { flexDirection: 'row', gap: 6 },
  traitDot: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.power },
  traitText: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted, flex: 1 },
});
