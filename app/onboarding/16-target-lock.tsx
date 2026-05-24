import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, SwipeRuler, OnboardingRail } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

export default function TargetLock() {
  const { weight, targetWeight, weightUnit, changeVelocity, setTargetWeight, computeTargetDate } =
    useOnboardingStore();

  const displayTarget = weightUnit === 'lb' ? Math.round(targetWeight * 2.20462) : targetWeight;
  const displayCurrent = weightUnit === 'lb' ? Math.round(weight * 2.20462) : weight;
  const diff = Math.abs(weight - targetWeight);
  const targetDate = computeTargetDate();

  const rateMap: Record<string, string> = {
    steady: '0.25 kg/wk',
    balanced: '0.5 kg/wk',
    intensive: '0.75 kg/wk',
  };

  const handleRulerChange = (val: number) => {
    const kgVal = weightUnit === 'lb' ? Math.round(val / 2.20462) : val;
    setTargetWeight(kgVal);
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={16} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>BLUEPRINT · STEP 4</Text>
          <Text style={styles.title}>Target{'\n'}Lock</Text>
          <Text style={styles.subtitle}>
            Dial in your goal weight. We'll calculate your exact arrival date.
          </Text>
        </Animated.View>

        {/* Current vs Target */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.comparisonRow}>
          <View style={styles.compItem}>
            <Text style={styles.compLabel}>CURRENT</Text>
            <Text style={[styles.compValue, { color: Colors.textMuted }]}>
              {displayCurrent} {weightUnit}
            </Text>
          </View>
          <View style={styles.compArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
          <View style={styles.compItem}>
            <Text style={styles.compLabel}>TARGET</Text>
            <Text style={[styles.compValue, { color: Colors.power }]}>
              {displayTarget} {weightUnit}
            </Text>
          </View>
        </Animated.View>

        {/* Ruler */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.rulerCard}>
          <SwipeRuler
            min={weightUnit === 'lb' ? 66 : 30}
            max={weightUnit === 'lb' ? 441 : 200}
            value={displayTarget}
            unit={weightUnit}
            onChange={handleRulerChange}
            accentColor={Colors.power}
          />
        </Animated.View>

        {/* Projection card */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.projectionCard}>
          <View style={styles.projHeader}>
            <Text style={styles.projTitle}>📅 Timeline Projection</Text>
          </View>
          <View style={styles.projRows}>
            <View style={styles.projRow}>
              <Text style={styles.projRowLabel}>Distance to goal</Text>
              <Text style={[styles.projRowValue, { color: Colors.power }]}>
                {diff.toFixed(1)} kg
              </Text>
            </View>
            <View style={styles.projRow}>
              <Text style={styles.projRowLabel}>Rate</Text>
              <Text style={[styles.projRowValue, { color: Colors.power }]}>
                {rateMap[changeVelocity ?? 'balanced']}
              </Text>
            </View>
            <View style={[styles.projRow, styles.projRowHighlight]}>
              <Text style={[styles.projRowLabel, { fontFamily: Typography.fontHeading }]}>
                Estimated arrival
              </Text>
              <Text style={[styles.projRowValue, { color: Colors.power, fontFamily: Typography.fontDisplay }]}>
                {targetDate}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <PillButton
            label="Lock Target →"
            onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.push('/onboarding/17-commitment-bridge'); }}
            variant="accent"
            accentColor={Colors.power}
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
  comparisonRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.subtleCard,
  },
  compItem: { flex: 1, alignItems: 'center', gap: 4 },
  compLabel: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.textMuted, letterSpacing: Typography.trackingWidest },
  compValue: { fontFamily: Typography.fontDisplay, fontSize: Typography['2xl'] },
  compArrow: { paddingHorizontal: 12 },
  arrowText: { fontSize: 20, color: Colors.textMuted },
  rulerCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.borderSubtle, alignItems: 'center', ...Shadows.subtleCard,
  },
  projectionCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.borderSubtle, ...Shadows.subtleCard,
  },
  projHeader: { padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  projTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.base, color: Colors.textPrimary },
  projRows: { padding: Spacing.md, gap: Spacing.sm },
  projRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  projRowHighlight: {
    marginTop: 4, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
  },
  projRowLabel: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  projRowValue: { fontFamily: Typography.fontLabel, fontSize: Typography.sm, color: Colors.textPrimary },
});
