import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore, InjuryZone } from '../../src/store/onboardingStore';

const INJURY_ZONES: { id: InjuryZone; label: string; emoji: string; caution: string }[] = [
  { id: 'shoulders', label: 'Shoulders', emoji: '🔵', caution: 'Avoid overhead pressing' },
  { id: 'knees', label: 'Knees', emoji: '🔴', caution: 'Reduce impact & deep squats' },
  { id: 'lower_back', label: 'Lower Back', emoji: '🟠', caution: 'Core-first programming' },
  { id: 'upper_back', label: 'Upper Back', emoji: '🟡', caution: 'Postural work priority' },
  { id: 'hips', label: 'Hips', emoji: '🟣', caution: 'Mobility-first approach' },
  { id: 'neck', label: 'Neck', emoji: '⚪', caution: 'No heavy neck loading' },
  { id: 'ankles', label: 'Ankles', emoji: '🟤', caution: 'Low-impact cardio only' },
  { id: 'wrists', label: 'Wrists', emoji: '🔶', caution: 'Neutral grip alternatives' },
];

function InjuryChip({
  zone,
  isSelected,
  onToggle,
}: {
  zone: (typeof INJURY_ZONES)[0];
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onToggle(); }}
      activeOpacity={0.8}
      style={[
        styles.chip,
        isSelected && { backgroundColor: Colors.burnDim, borderColor: Colors.burn, borderWidth: 2 },
      ]}
    >
      <Text style={styles.chipEmoji}>{zone.emoji}</Text>
      <View style={styles.chipText}>
        <Text style={[styles.chipLabel, isSelected && { color: Colors.burn }]}>{zone.label}</Text>
        {isSelected && <Text style={styles.chipCaution}>{zone.caution}</Text>}
      </View>
      {isSelected && (
        <View style={[styles.chipCheck, { backgroundColor: Colors.burn }]}>
          <Text style={styles.chipCheckText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function InjuryCheck() {
  const { injuryFree, injuryZones, setInjuryFree, toggleInjuryZone } = useOnboardingStore();

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={14} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>BLUEPRINT · STEP 2</Text>
          <Text style={styles.title}>Injury{'\n'}Screening</Text>
          <Text style={styles.subtitle}>Let us protect the zones that matter most.</Text>
        </Animated.View>

        {/* Injury-free toggle */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.toggleCard, injuryFree && styles.toggleCardActive]}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleEmoji}>✅</Text>
            <View style={styles.toggleText}>
              <Text style={[styles.toggleTitle, injuryFree && { color: Colors.signal }]}>
                I'm 100% injury free
              </Text>
              <Text style={styles.toggleSubtitle}>No limitations or pain zones</Text>
            </View>
          </View>
          <Switch
            value={injuryFree}
            onValueChange={(val) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setInjuryFree(val);
            }}
            trackColor={{ false: Colors.borderSubtle, true: Colors.signalGlow }}
            thumbColor={injuryFree ? Colors.signal : Colors.textMuted}
          />
        </Animated.View>

        {/* Injury zone selector — only shown when NOT injury free */}
        {!injuryFree && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.zonesSection}>
            <View style={styles.zonesHeader}>
              <Text style={styles.zonesTitle}>Select protection zones</Text>
              <Text style={styles.zonesSubtitle}>We'll swap risky exercises for safe alternatives</Text>
            </View>
            <View style={styles.zonesList}>
              {INJURY_ZONES.map((zone, i) => (
                <Animated.View key={zone.id} entering={FadeInDown.delay(i * 40).duration(300)}>
                  <InjuryChip
                    zone={zone}
                    isSelected={injuryZones.includes(zone.id)}
                    onToggle={() => toggleInjuryZone(zone.id)}
                  />
                </Animated.View>
              ))}
            </View>

            {injuryZones.length > 0 && (
              <View style={styles.safetyBanner}>
                <Text style={styles.safetyText}>
                  🛡️ {injuryZones.length} zone{injuryZones.length > 1 ? 's' : ''} protected — exercises will be adapted accordingly.
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/onboarding/15-velocity'); }}
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
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1.5, borderColor: Colors.borderSubtle, ...Shadows.subtleCard,
  },
  toggleCardActive: { borderColor: Colors.signal, backgroundColor: Colors.signalDim },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  toggleEmoji: { fontSize: 26 },
  toggleText: { gap: 2 },
  toggleTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.base, color: Colors.textPrimary },
  toggleSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted },
  zonesSection: { gap: Spacing.md },
  zonesHeader: { gap: 4 },
  zonesTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.base, color: Colors.textPrimary },
  zonesSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  zonesList: { gap: Spacing.xs },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.borderSubtle, ...Shadows.subtleCard,
  },
  chipEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  chipText: { flex: 1, gap: 2 },
  chipLabel: { fontFamily: Typography.fontHeading, fontSize: Typography.sm, color: Colors.textPrimary },
  chipCaution: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.burn },
  chipCheck: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chipCheckText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
  safetyBanner: { backgroundColor: Colors.burnDim, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: `${Colors.burn}25` },
  safetyText: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: Typography.sm * 1.6 },
});
