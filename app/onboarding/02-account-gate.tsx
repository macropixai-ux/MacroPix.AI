import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton, OnboardingRail } from '../../src/components';
import { useOnboardingStore } from '../../src/store/onboardingStore';

function SSOButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={ssoStyles.button}>
      <Text style={ssoStyles.icon}>{icon}</Text>
      <Text style={ssoStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const ssoStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 52,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: 20,
    ...Shadows.subtleCard,
  },
  icon: { fontSize: 20 },
  label: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
});

export default function AccountGate() {
  const { name, setName, setEmail } = useOnboardingStore();
  const [localName, setLocalName] = useState(name);
  const [focused, setFocused] = useState(false);

  const handleContinue = () => {
    if (localName.trim().length < 2) return;
    setName(localName.trim());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/03-biological-signals');
  };

  const handleSSO = (provider: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setName(localName.trim() || 'Athlete');
    setEmail(`user@${provider.toLowerCase()}.com`);
    router.push('/onboarding/03-biological-signals');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="dark" />
        <OnboardingRail currentScreen={2} style={styles.rail} />

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={styles.label}>STEP 1 OF 6</Text>
            <Text style={styles.title}>Create your{'\n'}profile</Text>
            <Text style={styles.subtitle}>Let's start with your name.</Text>
          </Animated.View>

          {/* Name Input */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              value={localName}
              onChangeText={setLocalName}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. Alex"
              placeholderTextColor={Colors.textMuted}
              style={[
                styles.input,
                focused && { borderColor: Colors.signal, borderWidth: 1.5 },
              ]}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </Animated.View>

          {/* Continue Button */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <PillButton
              label="Continue →"
              onPress={handleContinue}
              variant="accent"
              accentColor={Colors.signal}
              disabled={localName.trim().length < 2}
            />
          </Animated.View>

          {/* Divider */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* SSO Options */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.ssoList}>
            <SSOButton icon="🍎" label="Continue with Apple" onPress={() => handleSSO('Apple')} />
            <SSOButton icon="🔵" label="Continue with Google" onPress={() => handleSSO('Google')} />
            <SSOButton icon="📧" label="Continue with Email" onPress={() => handleSSO('Email')} />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(500).duration(400)}
            style={styles.disclaimer}
          >
            By continuing you agree to our Terms & Privacy Policy.
          </Animated.Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.void },
  scrollContent: { flexGrow: 1 },
  rail: { paddingTop: 56 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: { gap: 8 },
  label: {
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
  inputWrapper: { gap: 8 },
  inputLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  input: {
    height: 52,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    fontFamily: Typography.fontBody,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    ...Shadows.subtleCard,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  dividerText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  ssoList: { gap: Spacing.sm },
  disclaimer: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
