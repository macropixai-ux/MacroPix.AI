import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors, Typography } from '../../src/theme';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 12;

function Particle({ index }: { index: number }) {
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
  const radius = 80 + Math.random() * 60;
  const size = 3 + Math.random() * 4;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const targetX = Math.cos(angle) * radius;
  const targetY = Math.sin(angle) * radius;
  const delay = index * 120;

  useEffect(() => {
    opacity.value = withDelay(
      600 + delay,
      withRepeat(
        withSequence(withTiming(0.7, { duration: 1000 }), withTiming(0.2, { duration: 1000 })),
        -1,
        true
      )
    );
    translateX.value = withDelay(
      600 + delay,
      withRepeat(
        withSequence(
          withTiming(targetX, { duration: 2000, easing: Easing.out(Easing.cubic) }),
          withTiming(targetX * 1.2, { duration: 2000, easing: Easing.inOut(Easing.sine) })
        ),
        -1,
        true
      )
    );
    translateY.value = withDelay(
      600 + delay,
      withRepeat(
        withSequence(
          withTiming(targetY, { duration: 2000, easing: Easing.out(Easing.cubic) }),
          withTiming(targetY * 1.15, { duration: 2000, easing: Easing.inOut(Easing.sine) })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Colors.signal,
        },
      ]}
    />
  );
}

export default function ColdOpen() {
  const orbScale = useSharedValue(0);
  const orbOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(20);
  const glowScale = useSharedValue(1);

  const navigate = () => router.replace('/onboarding/01-welcome');

  useEffect(() => {
    // Orb grows in
    orbScale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.2)) });
    orbOpacity.value = withTiming(1, { duration: 700 });

    // Glow pulse
    glowScale.value = withDelay(
      800,
      withRepeat(
        withSequence(withTiming(1.15, { duration: 1400 }), withTiming(1, { duration: 1400 })),
        -1,
        true
      )
    );

    // Tagline fades in
    taglineOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
    taglineY.value = withDelay(1200, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));

    // Auto-advance
    const timer = setTimeout(() => runOnJS(navigate)(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
    opacity: orbOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background radial glow */}
      <Animated.View style={[styles.glowRing, glowStyle]} />

      {/* Particles */}
      <View style={styles.particleContainer}>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </View>

      {/* Central orb */}
      <Animated.View style={[styles.orbWrapper, orbStyle]}>
        <LinearGradient
          colors={[Colors.signal, '#34D399', Colors.fuel]}
          style={styles.orb}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.orbInner} />
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, taglineStyle]}>
        <Text style={styles.appName}>MacroPix.AI</Text>
        <Text style={styles.tagline}>Your body. Decoded by AI.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.void,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.signalGlow,
  },
  particleContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.signal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  orbInner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  taglineContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['2xl'],
    color: Colors.textPrimary,
    letterSpacing: Typography.trackingWide,
  },
  tagline: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.base,
    color: Colors.textSecondary,
    letterSpacing: Typography.trackingWide,
  },
});
