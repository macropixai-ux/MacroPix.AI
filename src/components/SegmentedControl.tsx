import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Radius } from '../theme';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({
  options,
  selectedIndex,
  onChange,
  accentColor = Colors.signal,
  style,
}: SegmentedControlProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const segmentWidth = containerWidth / options.length;

  const translateX = useSharedValue(0);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(w);
    translateX.value = selectedIndex * (w / options.length);
  };

  const handlePress = (index: number) => {
    translateX.value = withSpring(index * segmentWidth, {
      damping: 18,
      stiffness: 250,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(index);
  };

  // keep pill in sync when selectedIndex changes externally
  React.useEffect(() => {
    if (segmentWidth > 0) {
      translateX.value = withSpring(selectedIndex * segmentWidth, {
        damping: 18,
        stiffness: 250,
      });
    }
  }, [selectedIndex, segmentWidth]);

  return (
    <View style={[styles.track, style]} onLayout={handleLayout}>
      {/* Sliding pill */}
      <Animated.View
        style={[
          styles.pill,
          pillStyle,
          { width: segmentWidth, backgroundColor: accentColor },
        ]}
      />

      {/* Labels */}
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[styles.segment, { width: segmentWidth }]}
          onPress={() => handlePress(index)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.label,
              index === selectedIndex && styles.labelSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    padding: 4,
    height: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: Radius.full,
    zIndex: 0,
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.textInverse,
    fontFamily: Typography.fontHeading,
  },
});
