import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useEffect,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors, Radius, Shadows } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glowing?: boolean;
  glowColor?: string;
  padding?: number;
}

export function GlassCard({
  children,
  style,
  glowing = false,
  glowColor = Colors.signal,
  padding = 20,
}: GlassCardProps) {
  const glowOpacity = useSharedValue(0.08);

  useEffect(() => {
    if (glowing) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.18, { duration: 1200 }),
          withTiming(0.08, { duration: 1200 })
        ),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0);
    }
  }, [glowing]);

  const animatedGlow = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        glowing && {
          ...Shadows.accentGlow(glowColor),
          shadowColor: glowColor,
        },
        animatedGlow,
        style,
      ]}
    >
      <BlurView intensity={20} tint="light" style={[styles.blur, { padding }]}>
        {children}
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceGlass,
    ...Shadows.subtleCard,
  },
  blur: {
    flex: 1,
  },
});
