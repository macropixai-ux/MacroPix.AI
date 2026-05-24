import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail, GlassCard } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

const DAY_ABBREVS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildProgramName(goal: string | null, days: number, env: string | null): string {
  const dayStr = `${days}-Day`;
  const splitMap: Record<string, string> = {
    build_muscle: days >= 4 ? 'Push/Pull Split' : 'Full Body',
    lose_fat: 'Metabolic Circuit',
    recompose: 'Hybrid Strength',
    performance: 'Athletic Program',
  };
  const envSuffix = env === 'home' ? ' (Home)' : env === 'outdoor' ? ' (Outdoor)' : '';
  return `${dayStr} ${splitMap[goal ?? 'build_muscle'] ?? 'Custom Program'}${envSuffix}`;
}

export default function ProtocolReveal() {
  const store = useOnboardingStore();
  const { trainingDays, sessionDuration, focusZones, goal, trainingEnv } = store;

  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    cardScale.value = withSpring(1, { damping: 12 });
    cardOpacity.value = withSpring(1, { damping: 10 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const programName = buildProgramName(goal, trainingDays.length, trainingEnv);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={19} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.phase}>REVEAL</Text>
          <Text style={styles.title}>Your Program{'\n'}Is Ready 🎉</Text>
        </Animated.View>

        {/* Main protocol card */}
        <Animated.View style={[styles.heroCardWrapper, cardStyle]}>
          <LinearGradient colors={[Colors.signal, Colors.fuel]} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>✦ PERSONALIZED PROTOCOL</Text>
            </View>
            <Text style={styles.heroTitle}>{programName}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{trainingDays.length}x</Text>
                <Text style={styles.heroStatLabel}>per week</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{sessionDuration}m</Text>
                <Text style={styles.heroStatLabel}>sessions</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{trainingDays.length * sessionDuration}m</Text>
                <Text style={styles.heroStatLabel}>weekly vol.</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Calendar row */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.card}>
          <Text style={styles.cardLabel}>Training Schedule</Text>
          <View style={styles.calendarRow}>
            {ALL_DAYS.map((day, i) => {
              const isActive = trainingDays.includes(day as any);
              return (
                <View key={day} style={[styles.calDay, isActive && { backgroundColor: Colors.signal }]}>
                  <Text style={[styles.calDayText, isActive && { color: Colors.white }]}>{DAY_ABBREVS[i]}</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Muscle targets */}
        {focusZones.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.card}>
            <Text style={styles.cardLabel}>Target Muscle Groups</Text>
            <View style={styles.tagRow}>
              {focusZones.map((zone) => (
                <View key={zone} style={styles.muscleTag}>
                  <Text style={styles.muscleTagText}>{zone}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <PillButton
            label="See Your Macros →"
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/onboarding/20-macro-breakdown'); }}
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
  heroCardWrapper: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadows.accentGlow(Colors.signal) },
  heroCard: { padding: Spacing.xl, gap: Spacing.md, borderRadius: Radius.xl },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  heroBadgeText: { fontFamily: Typography.fontLabel, fontSize: 10, color: Colors.white, letterSpacing: 1 },
  heroTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography['2xl'], color: Colors.white, lineHeight: Typography['2xl'] * 1.2 },
  heroStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.md, padding: Spacing.md },
  heroStat: { flex: 1, alignItems: 'center', gap: 2 },
  heroStatValue: { fontFamily: Typography.fontDisplay, fontSize: Typography.xl, color: Colors.white },
  heroStatLabel: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: 'rgba(255,255,255,0.75)' },
  heroStatDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.subtleCard },
  cardLabel: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textSecondary, letterSpacing: Typography.trackingWide, textTransform: 'uppercase' },
  calendarRow: { flexDirection: 'row', gap: 6 },
  calDay: { flex: 1, height: 36, borderRadius: 8, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  calDayText: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.textMuted },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  muscleTag: { backgroundColor: Colors.signalDim, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: `${Colors.signal}30` },
  muscleTagText: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.signal, textTransform: 'capitalize' },
});
