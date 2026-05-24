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
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/theme';
import { PillButton } from '../../src/components';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setLoading(false);
      router.replace('/auth/success');
    }, 1200);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
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

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Branding */}
          <Animated.View entering={FadeIn.duration(500)} style={styles.brand}>
            <LinearGradient
              colors={[Colors.signal, Colors.fuel]}
              style={styles.brandOrb}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.brandOrbText}>🔬</Text>
            </LinearGradient>
            <Text style={styles.brandName}>MacroPix.AI</Text>
            <Text style={styles.brandTagline}>Your body. Decoded by AI.</Text>
          </Animated.View>

          {/* Form card */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.formCard}>
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in to continue your journey.</Text>

            <View style={styles.fields}>
              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  style={[
                    styles.input,
                    focusedField === 'email' && styles.inputFocused,
                  ]}
                />
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <TouchableOpacity>
                    <Text style={styles.forgotLink}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry
                  autoComplete="password"
                  style={[
                    styles.input,
                    focusedField === 'password' && styles.inputFocused,
                  ]}
                />
              </View>
            </View>

            <PillButton
              label="Sign In"
              onPress={handleLogin}
              variant="primary"
              loading={loading}
              disabled={!email || !password}
            />
          </Animated.View>

          {/* Divider */}
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          {/* SSO */}
          <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.ssoRow}>
            {[
              { icon: '🍎', label: 'Apple' },
              { icon: '🔵', label: 'Google' },
            ].map((p) => (
              <TouchableOpacity
                key={p.label}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.replace('/auth/success'); }}
                style={styles.ssoBtn}
              >
                <Text style={styles.ssoIcon}>{p.icon}</Text>
                <Text style={styles.ssoLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Sign up link */}
          <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/onboarding/00-cold-open')}>
              <Text style={styles.signupLink}>Start calibration</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.void },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  brand: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  brandOrb: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.signal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  brandOrbText: { fontSize: 30 },
  brandName: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['2xl'],
    color: Colors.textPrimary,
    letterSpacing: Typography.trackingWide,
  },
  brandTagline: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    ...Shadows.subtleCard,
  },
  formTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['2xl'],
    color: Colors.textPrimary,
  },
  formSubtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: -8,
  },
  fields: { gap: Spacing.md },
  fieldGroup: { gap: 8 },
  fieldLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.signal,
  },
  input: {
    height: 52,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    fontFamily: Typography.fontBody,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
  },
  inputFocused: {
    borderColor: Colors.signal,
    backgroundColor: Colors.surface,
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
  ssoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ssoBtn: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    ...Shadows.subtleCard,
  },
  ssoIcon: { fontSize: 18 },
  ssoLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  signupLink: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.signal,
  },
});
