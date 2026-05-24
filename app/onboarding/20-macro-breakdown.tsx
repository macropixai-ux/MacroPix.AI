import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);

  return <>{display}</>;
}

function MacroBar({
  label,
  grams,
  maxGrams,
  color,
  gradient,
  delay,
  unit = 'g',
}: {
  label: string;
  grams: number;
  maxGrams: number;
  color: string;
  gradient: [string, string];
  delay: number;
  unit?: string;
}) {
  const barWidth = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      barWidth.value = withTiming((grams / maxGrams) * 100, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [grams]);

  const barStyle = useAnimatedStyle(() => ({ width: `${barWidth.value}%` }));

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroMeta}>
        <View style={[styles.macroDot, { backgroundColor: color }]} />
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={[styles.macroGrams, { color }]}>
          {grams}{unit}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, barStyle]}>
          <LinearGradient colors={gradient} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </Animated.View>
      </View>
    </View>
  );
}

export default function MacroBreakdown() {
  const store = useOnboardingStore();
  const calories = store.computeCalories();
  const macros = store.computeMacros();
  const maxMacro = Math.max(macros.protein, macros.carbs, macros.fats);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={20} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.phase}>REVEAL</Text>
          <Text style={styles.title}>Daily{'\n'}Nutrition Target</Text>
          <Text style={styles.subtitle}>Calibrated to your body, goal and activity level.</Text>
        </Animated.View>

        {/* Calorie hero */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.calorieCard}>
          <LinearGradient colors={[Colors.signal, Colors.fuel]} style={styles.calorieGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.calorieLabel}>DAILY CALORIE TARGET</Text>
            <Text style={styles.calorieValue}>
              <CountUp target={calories} duration={2000} />
            </Text>
            <Text style={styles.calorieUnit}>kcal / day</Text>
          </LinearGradient>
        </Animated.View>

        {/* Macro breakdown */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.macroCard}>
          <Text style={styles.cardLabel}>Macro Targets</Text>
          <View style={styles.macroList}>
            <MacroBar
              label="Protein"
              grams={macros.protein}
              maxGrams={maxMacro}
              color="#6366F1"
              gradient={['#6366F1', '#8B5CF6']}
              delay={500}
            />
            <MacroBar
              label="Carbs"
              grams={macros.carbs}
              maxGrams={maxMacro}
              color={Colors.fuel}
              gradient={[Colors.fuel, '#38BDF8']}
              delay={700}
            />
            <MacroBar
              label="Fats"
              grams={macros.fats}
              maxGrams={maxMacro}
              color={Colors.burn}
              gradient={[Colors.burn, '#FB923C']}
              delay={900}
            />
          </View>
        </Animated.View>

        {/* Macro total pills */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.pillsRow}>
          {[
            { label: 'Protein', value: `${macros.protein}g`, color: '#6366F1' },
            { label: 'Carbs', value: `${macros.carbs}g`, color: Colors.fuel },
            { label: 'Fats', value: `${macros.fats}g`, color: Colors.burn },
          ].map((m) => (
            <View key={m.label} style={[styles.pill, { borderColor: m.color, backgroundColor: `${m.color}10` }]}>
              <Text style={[styles.pillValue, { color: m.color }]}>{m.value}</Text>
              <Text style={styles.pillLabel}>{m.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Equation note */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.noteCard}>
          <Text style={styles.noteText}>
            🧮 Computed via Mifflin-St Jeor BMR + activity multiplier + goal adjustment.
            Recalibrates automatically as you log progress.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(400)}>
          <PillButton
            label="See App Features →"
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/onboarding/21-feature-flash'); }}
            variant="accent"
            accentColor={Colors.signal}
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
  phase: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.signal, letterSpacing: Typography.trackingWidest },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography['3xl'], color: Colors.textPrimary, lineHeight: Typography['3xl'] * 1.2 },
  subtitle: { fontFamily: Typography.fontBody, fontSize: Typography.base, color: Colors.textSecondary },
  calorieCard: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadows.accentGlow(Colors.signal) },
  calorieGradient: { padding: Spacing.xl, alignItems: 'center', gap: 4 },
  calorieLabel: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', letterSpacing: Typography.trackingWidest },
  calorieValue: { fontFamily: Typography.fontDisplay, fontSize: Typography['5xl'], color: Colors.white },
  calorieUnit: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)' },
  macroCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.subtleCard },
  cardLabel: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textSecondary, letterSpacing: Typography.trackingWide, textTransform: 'uppercase' },
  macroList: { gap: Spacing.md },
  macroRow: { gap: 8 },
  macroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  macroDot: { width: 10, height: 10, borderRadius: 5 },
  macroLabel: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary, flex: 1 },
  macroGrams: { fontFamily: Typography.fontHeading, fontSize: Typography.sm },
  barTrack: { height: 10, backgroundColor: Colors.surfaceElevated, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, overflow: 'hidden' },
  pillsRow: { flexDirection: 'row', gap: Spacing.sm },
  pill: { flex: 1, alignItems: 'center', padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, gap: 4 },
  pillValue: { fontFamily: Typography.fontDisplay, fontSize: Typography.xl },
  pillLabel: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted },
  noteCard: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, padding: Spacing.md },
  noteText: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted, lineHeight: Typography.xs * 1.7 },
});
