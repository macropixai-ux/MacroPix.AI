import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, BodyDiagram, OnboardingRail } from '../../src/components';
import { useOnboardingStore, FocusZone } from '../../src/store/onboardingStore';

export default function FocusZones() {
  const { focusZones, toggleFocusZone } = useOnboardingStore();
  const [view, setView] = useState<'front' | 'back'>('front');

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/07-training-rhythm');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={6} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>GOALS · STEP 2</Text>
          <Text style={styles.title}>Focus Zones</Text>
          <Text style={styles.subtitle}>
            Where do you want to build? Tap muscle groups directly or use the chips below.
          </Text>
        </Animated.View>

        {/* View toggle */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.viewToggle}>
          {(['front', 'back'] as const).map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => {
                setView(v);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.toggleBtn,
                view === v && {
                  backgroundColor: Colors.fuel,
                  borderColor: Colors.fuel,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  view === v && { color: Colors.white },
                ]}
              >
                {v === 'front' ? '⬆️ Front' : '⬇️ Back'}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Body diagram */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.diagramCard}>
          <BodyDiagram
            selectedZones={focusZones}
            onToggleZone={(z) => toggleFocusZone(z as FocusZone)}
            view={view}
            accentColor={Colors.fuel}
          />
        </Animated.View>

        {/* Selection summary */}
        {focusZones.length > 0 && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Selected zones</Text>
            <Text style={styles.summaryValue}>{focusZones.join(' · ')}</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PillButton
            label={focusZones.length > 0 ? `Continue with ${focusZones.length} zones →` : 'Skip for now →'}
            onPress={handleContinue}
            variant="accent"
            accentColor={Colors.fuel}
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
  viewToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnText: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  diagramCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    alignItems: 'center',
    ...Shadows.subtleCard,
  },
  summaryCard: {
    backgroundColor: Colors.fuelDim,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.fuel}30`,
    gap: 4,
  },
  summaryLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.fuel,
    letterSpacing: Typography.trackingWide,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
});
