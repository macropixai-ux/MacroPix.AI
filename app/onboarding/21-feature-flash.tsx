import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - Spacing.xl * 2;

const FEATURES = [
  {
    icon: '📷',
    title: 'Meal Scanner',
    subtitle: 'Instant macro analysis',
    description: 'Point your camera at any meal. AI identifies foods and logs macros in under 3 seconds.',
    gradient: ['#6366F1', '#8B5CF6'] as [string, string],
    mockUI: ['🍗 Grilled Chicken  +31g protein', '🥦 Broccoli  +5g protein', '🍚 Brown Rice  +45g carbs'],
  },
  {
    icon: '🤖',
    title: 'Daily Coaching',
    subtitle: 'Personalized insights every morning',
    description: 'Your AI coach analyzes yesterday\'s data and delivers a custom briefing each morning.',
    gradient: [Colors.signal, '#34D399'] as [string, string],
    mockUI: ['📈 You hit 94% of your protein target', '💧 Hydration was below average', '💡 Today: Push session · 4 exercises'],
  },
  {
    icon: '📊',
    title: 'Progress Analytics',
    subtitle: 'Visualize your transformation',
    description: 'Trend graphs show weight, strength, and body composition changes over time.',
    gradient: [Colors.fuel, '#06B6D4'] as [string, string],
    mockUI: ['▲ +2.3kg muscle this month', '▼ -1.8kg fat this month', '🔥 Streak: 14 days'],
  },
];

function FeatureCard({ feature, isActive }: { feature: typeof FEATURES[0]; isActive: boolean }) {
  return (
    <View style={[styles.featureCard, { width: CARD_WIDTH }]}>
      <LinearGradient colors={feature.gradient} style={styles.featureHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={styles.featureIcon}>{feature.icon}</Text>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>

        {/* Mock UI */}
        <View style={styles.mockContainer}>
          {feature.mockUI.map((line, i) => (
            <Animated.View key={i} entering={isActive ? FadeInDown.delay(i * 150).duration(300) : undefined} style={styles.mockLine}>
              <Text style={styles.mockLineText}>{line}</Text>
            </Animated.View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.featureBody}>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );
}

export default function FeatureFlash() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    if (idx !== activeIdx) {
      setActiveIdx(idx);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const goToNext = () => {
    if (activeIdx < FEATURES.length - 1) {
      const nextIdx = activeIdx + 1;
      scrollRef.current?.scrollTo({ x: nextIdx * CARD_WIDTH, animated: true });
      setActiveIdx(nextIdx);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/onboarding/24-badge-unlock');
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar style="dark" />
      <OnboardingRail currentScreen={21} style={styles.rail} />

      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={styles.phase}>REVEAL</Text>
        <Text style={styles.title}>What's inside</Text>
        <Text style={styles.subtitle}>A glimpse of the tools that'll drive your results.</Text>
      </Animated.View>

      {/* Horizontal swipe deck */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollRow}
        style={styles.scrollArea}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} isActive={activeIdx === i} />
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {FEATURES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => { scrollRef.current?.scrollTo({ x: i * CARD_WIDTH, animated: true }); setActiveIdx(i); }}
          >
            <View style={[styles.dot, activeIdx === i && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomArea}>
        <PillButton
          label={activeIdx < FEATURES.length - 1 ? 'Next Feature →' : 'Continue →'}
          onPress={goToNext}
          variant="accent"
          accentColor={Colors.signal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.void },
  rail: { paddingTop: 56 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, gap: 6 },
  phase: { fontFamily: Typography.fontLabel, fontSize: Typography.xs, color: Colors.signal, letterSpacing: Typography.trackingWidest },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography['2xl'], color: Colors.textPrimary },
  subtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary },
  scrollArea: { flex: 1 },
  scrollRow: { paddingHorizontal: Spacing.xl, gap: 0, paddingTop: Spacing.lg },
  featureCard: { gap: 0, borderRadius: Radius.xl, overflow: 'hidden', ...Shadows.subtleCard },
  featureHero: { padding: Spacing.xl, gap: Spacing.sm, minHeight: 280 },
  featureIcon: { fontSize: 36 },
  featureTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography['2xl'], color: Colors.white },
  featureSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: 'rgba(255,255,255,0.8)' },
  mockContainer: { marginTop: Spacing.md, gap: 8 },
  mockLine: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  mockLineText: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.white },
  featureBody: { backgroundColor: Colors.surface, padding: Spacing.lg },
  featureDescription: { fontFamily: Typography.fontBody, fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: Typography.sm * 1.6 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: Spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.borderSubtle },
  dotActive: { backgroundColor: Colors.signal, width: 24 },
  bottomArea: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
});
