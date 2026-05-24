import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Radius, Shadows } from '../theme';

type Variant = 'primary' | 'ghost' | 'accent';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accentColor?: string;
  icon?: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PillButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accentColor = Colors.signal,
  icon,
}: PillButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[animatedStyle, style]}
      >
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, disabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textInverse} size="small" />
          ) : (
            <>
              {icon}
              <Text style={styles.labelPrimary}>{label}</Text>
            </>
          )}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  if (variant === 'accent') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[animatedStyle, style]}
      >
        <Animated.View
          style={[
            styles.button,
            { backgroundColor: accentColor },
            disabled && styles.disabled,
            Shadows.accentGlow(accentColor),
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textInverse} size="small" />
          ) : (
            <>
              {icon}
              <Text style={styles.labelPrimary}>{label}</Text>
            </>
          )}
        </Animated.View>
      </AnimatedTouchable>
    );
  }

  // ghost
  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[animatedStyle, style]}
    >
      <Animated.View
        style={[
          styles.button,
          styles.ghost,
          { borderColor: accentColor },
          disabled && styles.disabled,
        ]}
      >
        {icon}
        <Text style={[styles.labelGhost, { color: accentColor }]}>{label}</Text>
      </Animated.View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  ghost: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
  },
  disabled: {
    opacity: 0.5,
  },
  labelPrimary: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.base,
    color: Colors.textInverse,
    letterSpacing: Typography.trackingWide,
  },
  labelGhost: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.base,
    letterSpacing: Typography.trackingWide,
  },
});
