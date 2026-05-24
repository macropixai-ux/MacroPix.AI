import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_ABBREVS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function AuthSuccess() {
  const store = useOnboardingStore();
  const {
    name,
    goal,
    weight,
    targetWeight,
    trainingDays,
    sessionDuration,
    dietApproach,
    activityLevel,
    subscriptionTier,
    reset,
    computeCalories,
    computeMacros,
    computeTargetDate,
  } = store;

  const calories = computeCalories();
  const macros = computeMacros();
  const targetDate = computeTargetDate();

  const handleRestart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    reset();
    router.replace('/onboarding/00-cold-open');
  };

  const goalLabel: Record<string, string> = {
    build_muscle: '💪 Build Muscle',
    lose_fat: '🔥 Lose Fat',
    recompose: '⚡ Recompose',
    performance: '🏆 Performance',
  };

  const statItems = [
    { label: 'Calories', value: `${calories} kcal`, color: Colors.signal, icon: '🔥' },
    { label: 'Protein', value: `${macros.protein}g`, color: '#6366F1', icon: '🥩' },
    { label: 'Carbs', value: `${macros.carbs}g`, color: Colors.fuel, icon: '🌾' },
    { label: 'Fats', value: `${macros.fats}g`, color: Colors.burn, icon: '🥑' },
  ];

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      {/* Hero header */}
      <LinearGradient
        colors={[Colors.signal, Colors.fuel]}
        style={styles.heroHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.heroContent}>
          <View style={styles.statusDot} />
          <Text style={styles.heroLabel}>SYSTEM ONLINE</Text>
          <Text style={styles.heroGreeting}>
            Welcome back,{'\n'}
            <Text style={styles.heroName}>{name || 'Athlete'} 👋</Text>
          </Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              {subscriptionTier === 'yearly' ? '⭐ Premium · Yearly' : subscriptionTier === 'monthly' ? '⭐ Premium · Monthly' : '🆓 Free Plan'}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Goal & targets summary */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Your Mission</Text>
          <View style={styles.missionRow}>
            <View style={styles.missionItem}>
              <Text style={styles.missionLabel}>PRIMARY GOAL</Text>
              <Text style={styles.missionValue}>{goalLabel[goal ?? 'build_muscle'] ?? '🎯 Custom'}</Text>
            </View>
            <View style={styles.missionDivider} />
            <View style={styles.missionItem}>
              <Text style={styles.missionLabel}>TARGET DATE</Text>
              <Text style={[styles.missionValue, { color: Colors.signal, fontSize: Typography.sm }]}>
                {targetDate}
              </Text>
            </View>
          </View>
          <View style={styles.weightRow}>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Current</Text>
              <Text style={styles.weightValue}>{weight} kg</Text>
            </View>
            <View style={styles.weightArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Target</Text>
              <Text style={[styles.weightValue, { color: Colors.signal }]}>{targetWeight} kg</Text>
            </View>
            <View style={styles.weightDiff}>
              <Text style={styles.weightDiffText}>
                {weight > targetWeight ? '−' : '+'}{Math.abs(weight - targetWeight).toFixed(1)} kg
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Daily nutrition targets */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Daily Nutrition</Text>
          <View style={styles.statsGrid}>
            {statItems.map((item) => (
              <View key={item.label} style={[styles.statCard, { borderColor: `${item.color}30`, backgroundColor: `${item.color}08` }]}>
                <Text style={styles.statIcon}>{item.icon}</Text>
                <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Training schedule */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Training Schedule</Text>
          <View style={styles.calRow}>
            {ALL_DAYS.map((day, i) => {
              const isActive = trainingDays.includes(day as any);
              return (
                <View key={day} style={[styles.calDay, isActive && { backgroundColor: Colors.signal }]}>
                  <Text style={[styles.calText, isActive && { color: Colors.white }]}>
                    {DAY_ABBREVS[i]}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.trainingMeta}>
            <Text style={styles.trainingMetaText}>
              {trainingDays.length} sessions/week · {sessionDuration} min each ·{' '}
              {trainingDays.length * sessionDuration} min total
            </Text>
          </View>
        </Animated.View>

        {/* Lifestyle */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Profile Details</Text>
          <View style={styles.detailsList}>
            {[
              { label: 'Diet Approach', value: dietApproach?.replace('_', ' ') ?? '—', icon: '🥗' },
              { label: 'Activity Level', value: activityLevel?.replace('_', ' ') ?? '—', icon: '⚡' },
            ].map((d) => (
              <View key={d.label} style={styles.detailRow}>
                <Text style={styles.detailIcon}>{d.icon}</Text>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Restart demo button */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.actions}>
          <PillButton
            label="🔄 Restart Demo"
            onPress={handleRestart}
            variant="ghost"
            accentColor={Colors.signal}
          />
          <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>← Back to login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.void },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  heroHeader: {
    paddingTop: 64,
    paddingBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
  },
  heroContent: { gap: Spacing.sm },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  heroLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: Typography.trackingWidest,
  },
  heroGreeting: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xl,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: Typography.xl * 1.3,
  },
  heroName: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['3xl'],
    color: Colors.white,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  heroBadgeText: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.white,
    letterSpacing: 0.4,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
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
  cardTitle: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionItem: { flex: 1, gap: 4 },
  missionLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.trackingWidest,
  },
  missionValue: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  missionDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderSubtle,
    marginHorizontal: Spacing.md,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 8,
  },
  weightItem: { flex: 1, alignItems: 'center', gap: 2 },
  weightLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  weightValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.lg,
    color: Colors.textPrimary,
  },
  weightArrow: { paddingHorizontal: 4 },
  arrowText: { fontSize: 16, color: Colors.textMuted },
  weightDiff: {
    backgroundColor: Colors.signalDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  weightDiffText: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.signal,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: 4,
  },
  statIcon: { fontSize: 20 },
  statValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.lg,
  },
  statLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  calRow: {
    flexDirection: 'row',
    gap: 6,
  },
  calDay: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calText: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  trainingMeta: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    padding: 10,
    alignItems: 'center',
  },
  trainingMetaText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  detailsList: { gap: Spacing.sm },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailIcon: { fontSize: 18, width: 28 },
  detailLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  actions: { gap: Spacing.sm, paddingTop: Spacing.sm },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginLinkText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
});
