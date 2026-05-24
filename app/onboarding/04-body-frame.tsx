import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, SwipeRuler, OnboardingRail, SegmentedControl } from '../../src/components';
import { useOnboardingStore, WeightUnit, HeightUnit } from '../../src/store/onboardingStore';

// Height picker values
const CM_VALUES = Array.from({ length: 121 }, (_, i) => 130 + i); // 130–250 cm
const FT_OPTIONS = Array.from({ length: 40 }, (_, i) => {
  const totalInches = 48 + i; // 4'0" to 7'3"
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft}'${inch}"`;
});

function MetricToggle({
  unit,
  onChange,
  options,
}: {
  unit: string;
  onChange: (u: any) => void;
  options: [string, string];
}) {
  const idx = unit === options[0] ? 0 : 1;
  return (
    <SegmentedControl
      options={options}
      selectedIndex={idx}
      onChange={(i) => onChange(options[i])}
      accentColor={Colors.signal}
      style={{ width: 160 }}
    />
  );
}

export default function BodyFrame() {
  const {
    height,
    weight,
    weightUnit,
    heightUnit,
    setHeight,
    setWeight,
    setWeightUnit,
    setHeightUnit,
  } = useOnboardingStore();

  const [localWeight, setLocalWeight] = useState(weight);
  const [localHeight, setLocalHeight] = useState(height);

  // Convert for display
  const displayWeight = weightUnit === 'lb' ? Math.round(localWeight * 2.20462) : localWeight;
  const weightMin = weightUnit === 'lb' ? 66 : 30;
  const weightMax = weightUnit === 'lb' ? 441 : 200;

  const handleWeightChange = (val: number) => {
    setLocalWeight(weightUnit === 'lb' ? Math.round(val / 2.20462) : val);
  };

  const handleWeightUnitChange = (u: WeightUnit) => {
    setWeightUnit(u);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = () => {
    setHeight(localHeight);
    setWeight(localWeight);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/05-mission');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={4} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>IDENTITY · STEP 4</Text>
          <Text style={styles.title}>Body Frame</Text>
          <Text style={styles.subtitle}>Your base metrics power the calorie engine.</Text>
        </Animated.View>

        {/* Height Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Height</Text>
            <MetricToggle
              unit={heightUnit}
              onChange={(u: HeightUnit) => {
                setHeightUnit(u);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              options={['cm', 'ft']}
            />
          </View>

          <View style={styles.heightDisplay}>
            <Text style={[styles.heightValue, { color: Colors.signal }]}>
              {heightUnit === 'cm'
                ? `${localHeight} cm`
                : `${Math.floor(localHeight / 30.48)}'${Math.round((localHeight % 30.48) / 2.54)}"`}
            </Text>
          </View>

          {/* Height picker: segmented selector */}
          <View style={styles.heightPickerRow}>
            {CM_VALUES.slice(0, 7).map((cm, i) => {
              const actual = localHeight - 3 + i;
              if (actual < 130 || actual > 250) return null;
              const isSelected = actual === localHeight;
              return (
                <TouchableOpacity
                  key={cm}
                  onPress={() => {
                    setLocalHeight(actual);
                    Haptics.selectionAsync();
                  }}
                  style={[
                    styles.heightTick,
                    isSelected && {
                      backgroundColor: Colors.signal,
                      borderColor: Colors.signal,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.heightTickText,
                      isSelected && styles.heightTickTextSelected,
                    ]}
                  >
                    {actual}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Fine tune slider via SwipeRuler */}
          <SwipeRuler
            min={130}
            max={250}
            value={localHeight}
            unit="cm"
            onChange={setLocalHeight}
            accentColor={Colors.signal}
            style={styles.ruler}
          />
        </Animated.View>

        {/* Weight Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current Weight</Text>
            <MetricToggle
              unit={weightUnit}
              onChange={handleWeightUnitChange}
              options={['kg', 'lb']}
            />
          </View>

          <SwipeRuler
            min={weightMin}
            max={weightMax}
            value={displayWeight}
            unit={weightUnit}
            onChange={handleWeightChange}
            accentColor={Colors.signal}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={handleContinue}
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
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  header: { gap: 8 },
  stepLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.signal,
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    ...Shadows.subtleCard,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  heightDisplay: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  heightValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['4xl'],
  },
  heightPickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  heightTick: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heightTickText: {
    fontFamily: Typography.fontBody,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  heightTickTextSelected: {
    color: Colors.white,
    fontFamily: Typography.fontHeading,
  },
  ruler: {
    marginTop: 8,
  },
});
