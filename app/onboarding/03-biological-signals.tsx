import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, WheelPicker, OnboardingRail } from '../../src/components';
import { useOnboardingStore, Sex } from '../../src/store/onboardingStore';

// Date arrays
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - 14 - i);

function SexCard({
  sexType,
  label,
  emoji,
  isSelected,
  onPress,
  accentColor,
}: {
  sexType: Sex;
  label: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  accentColor: string;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.94, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={[styles.sexCardWrapper, animStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={[
          styles.sexCard,
          isSelected && {
            borderColor: accentColor,
            borderWidth: 2,
            backgroundColor: `${accentColor}10`,
          },
        ]}
      >
        <Text style={styles.sexEmoji}>{emoji}</Text>
        <Text
          style={[
            styles.sexLabel,
            isSelected && { color: accentColor, fontFamily: Typography.fontHeading },
          ]}
        >
          {label}
        </Text>
        {isSelected && (
          <View style={[styles.sexCheckBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.sexCheck}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function computeAge(day: number, monthIdx: number, year: number): number {
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() - monthIdx;
  if (m < 0 || (m === 0 && today.getDate() < day)) age--;
  return Math.max(0, age);
}

export default function BiologicalSignals() {
  const { sex, setSex, setDob } = useOnboardingStore();
  const [dayIdx, setDayIdx] = useState(14);
  const [monthIdx, setMonthIdx] = useState(5);
  const [yearIdx, setYearIdx] = useState(20);

  const day = DAYS[dayIdx];
  const month = monthIdx + 1;
  const year = YEARS[yearIdx];
  const age = computeAge(day, monthIdx, year);

  const handleContinue = () => {
    setDob({ day, month, year });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/04-body-frame');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={3} style={styles.rail} />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.stepLabel}>IDENTITY · STEP 3</Text>
          <Text style={styles.title}>Biological{'\n'}Signals</Text>
          <Text style={styles.subtitle}>Help us calibrate your metabolism accurately.</Text>
        </Animated.View>

        {/* Sex selector */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.sectionLabel}>Biological Sex</Text>
          <View style={styles.sexRow}>
            <SexCard
              sexType="male"
              label="Male"
              emoji="♂️"
              isSelected={sex === 'male'}
              onPress={() => setSex('male')}
              accentColor={Colors.signal}
            />
            <SexCard
              sexType="female"
              label="Female"
              emoji="♀️"
              isSelected={sex === 'female'}
              onPress={() => setSex('female')}
              accentColor={Colors.signal}
            />
          </View>
        </Animated.View>

        {/* Date of Birth */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.dobHeader}>
            <Text style={styles.sectionLabel}>Date of Birth</Text>
            {age > 0 && (
              <View style={styles.ageBadge}>
                <Text style={styles.ageBadgeText}>{age} years old</Text>
              </View>
            )}
          </View>

          <View style={styles.wheelRow}>
            <WheelPicker
              items={DAYS}
              selectedIndex={dayIdx}
              onSelect={setDayIdx}
              label="DAY"
            />
            <WheelPicker
              items={MONTHS}
              selectedIndex={monthIdx}
              onSelect={setMonthIdx}
              label="MONTH"
              style={{ width: 120 }}
            />
            <WheelPicker
              items={YEARS}
              selectedIndex={yearIdx}
              onSelect={setYearIdx}
              label="YEAR"
              style={{ width: 90 }}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <PillButton
            label="Continue →"
            onPress={handleContinue}
            variant="accent"
            accentColor={Colors.signal}
            disabled={!sex}
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
  sectionLabel: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    letterSpacing: Typography.trackingWide,
    marginBottom: 12,
  },
  sexRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sexCardWrapper: { flex: 1 },
  sexCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    ...Shadows.subtleCard,
  },
  sexEmoji: { fontSize: 32 },
  sexLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  sexCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sexCheck: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  dobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ageBadge: {
    backgroundColor: Colors.signalDim,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  ageBadgeText: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.signal,
  },
  wheelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.subtleCard,
  },
});
