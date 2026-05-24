import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeInDown, FadeIn,
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withSpring,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { OnboardingRail } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

// Countdown timer — 14m59s
function useCountdown(initialSeconds = 14 * 60 + 59) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function PlanCard({
  title,
  price,
  period,
  badge,
  isBest,
  isSelected,
  onSelect,
}: {
  title: string;
  price: string;
  period: string;
  badge?: string;
  isBest?: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 12 }, () => { scale.value = withSpring(1); });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <Animated.View style={[style]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        {isBest ? (
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={[styles.planCard, styles.planCardSelected]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <PlanCardContent title={title} price={price} period={period} badge={badge} isSelected isBest />
          </LinearGradient>
        ) : (
          <View style={[styles.planCard, isSelected && styles.planCardSelectedBorder]}>
            <PlanCardContent title={title} price={price} period={period} badge={badge} isSelected={isSelected} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function PlanCardContent({ title, price, period, badge, isSelected, isBest = false }: any) {
  return (
    <View style={styles.planInner}>
      <View style={styles.planLeft}>
        <View style={styles.radio}>
          {isSelected && <View style={styles.radioFill} />}
        </View>
        <View>
          <Text style={[styles.planTitle, isBest && { color: Colors.white }]}>{title}</Text>
          {badge && <Text style={[styles.planBadge, isBest && { color: 'rgba(255,255,255,0.9)' }]}>{badge}</Text>}
        </View>
      </View>
      <View style={styles.planRight}>
        <Text style={[styles.planPrice, isBest && { color: Colors.white }]}>{price}</Text>
        <Text style={[styles.planPeriod, isBest && { color: 'rgba(255,255,255,0.8)' }]}>{period}</Text>
      </View>
    </View>
  );
}

function PulsingCTA({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.15);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.03, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true);
    glow.value = withRepeat(withSequence(withTiming(0.3, { duration: 900 }), withTiming(0.1, { duration: 900 })), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  return (
    <Animated.View style={[styles.ctaWrapper, pulseStyle]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.ctaLabel}>Start Free Trial →</Text>
          <Text style={styles.ctaSub}>3 days free, then billed automatically</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Paywall() {
  const { setSubscriptionTier } = useOnboardingStore();
  const [selected, setSelected] = useState<'yearly' | 'monthly'>('yearly');
  const countdown = useCountdown();

  const handleCTA = () => {
    setSubscriptionTier(selected);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/onboarding/27-trial-confirm');
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={26} style={styles.rail} />
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.phase}>LAUNCH</Text>
          <Text style={styles.title}>Go{'\n'}Premium</Text>
        </Animated.View>

        {/* Countdown timer */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.timer}>
          <Text style={styles.timerLabel}>⏳ Special offer expires in</Text>
          <Text style={styles.timerValue}>{countdown}</Text>
        </Animated.View>

        {/* Plan cards */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.plans}>
          <PlanCard
            title="Yearly"
            price="$4.99"
            period="/month"
            badge="🏆 Best Value · Save 40%"
            isBest
            isSelected={selected === 'yearly'}
            onSelect={() => setSelected('yearly')}
          />
          <PlanCard
            title="Monthly"
            price="$8.99"
            period="/month"
            isSelected={selected === 'monthly'}
            onSelect={() => setSelected('monthly')}
          />
        </Animated.View>

        {/* Trust badges */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.trustRow}>
          {['🔒 Secure checkout', '✅ Cancel anytime', '⭐ 4.8 Store rating'].map((t) => (
            <View key={t} style={styles.trustBadge}>
              <Text style={styles.trustText}>{t}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Feature bullets */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.featuresList}>
          {['Unlimited meal scanning', 'Daily AI coaching briefings', 'Advanced progress analytics', 'Personalized program updates', 'Priority support'].map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <PulsingCTA onPress={handleCTA} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <TouchableOpacity onPress={() => router.push('/onboarding/27-trial-confirm')}>
            <Text style={styles.skipText}>Continue without Premium</Text>
          </TouchableOpacity>
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
  phase: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.fuel, letterSpacing: Typography.trackingWidest },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography['3xl'], color: Colors.textPrimary, lineHeight: Typography['3xl'] * 1.2 },
  timer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FEF3C7', borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  timerLabel: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: '#92400E' },
  timerValue: { fontFamily: Typography.fontDisplay, fontSize: Typography.xl, color: '#92400E' },
  plans: { gap: Spacing.sm },
  planCard: {
    borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surface, ...Shadows.subtleCard,
  },
  planCardSelected: { borderWidth: 0 },
  planCardSelectedBorder: { borderColor: '#6366F1', borderWidth: 2 },
  planInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.borderSubtle, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.3)' },
  radioFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.white },
  planTitle: { fontFamily: Typography.fontHeading, fontSize: Typography.base, color: Colors.textPrimary },
  planBadge: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted },
  planRight: { alignItems: 'flex-end' },
  planPrice: { fontFamily: Typography.fontDisplay, fontSize: Typography.xl, color: Colors.textPrimary },
  planPeriod: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted },
  trustRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  trustBadge: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  trustText: { fontFamily: Typography.fontBody, fontSize: 11, color: Colors.textSecondary },
  featuresList: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureCheck: { fontSize: 16, color: Colors.success },
  featureText: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  ctaWrapper: { borderRadius: Radius.full, shadowColor: '#6366F1', shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 10 },
  ctaButton: { height: 64, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', gap: 2 },
  ctaLabel: { fontFamily: Typography.fontDisplay, fontSize: Typography.base, color: Colors.white, letterSpacing: Typography.trackingWide },
  ctaSub: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: 'rgba(255,255,255,0.75)' },
  skipText: { fontFamily: Typography.fontBody, fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'center', paddingVertical: 8 },
});
