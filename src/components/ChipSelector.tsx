import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Radius, Spacing } from '../theme';

interface ChipOption {
  id: string;
  label: string;
  icon?: string;
}

interface ChipSelectorProps {
  options: ChipOption[];
  selected: string[];
  onToggle: (id: string) => void;
  accentColor?: string;
  direction?: 'horizontal' | 'vertical';
  multiSelect?: boolean;
  style?: StyleProp<ViewStyle>;
}

function Chip({
  option,
  isSelected,
  onToggle,
  accentColor,
}: {
  option: ChipOption;
  isSelected: boolean;
  onToggle: (id: string) => void;
  accentColor: string;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.92, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1.04, { damping: 10, stiffness: 400 }, () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 300 });
      });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(option.id);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          styles.chip,
          isSelected && { backgroundColor: accentColor, borderColor: accentColor },
        ]}
      >
        {option.icon ? (
          <Text style={styles.chipIcon}>{option.icon}</Text>
        ) : null}
        <Text
          style={[
            styles.chipLabel,
            isSelected && styles.chipLabelSelected,
          ]}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ChipSelector({
  options,
  selected,
  onToggle,
  accentColor = Colors.signal,
  direction = 'horizontal',
  style,
}: ChipSelectorProps) {
  if (direction === 'horizontal') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, style]}
      >
        {options.map((opt) => (
          <Chip
            key={opt.id}
            option={opt}
            isSelected={selected.includes(opt.id)}
            onToggle={onToggle}
            accentColor={accentColor}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.column, style]}>
      {options.map((opt) => (
        <Chip
          key={opt.id}
          option={opt}
          isSelected={selected.includes(opt.id)}
          onToggle={onToggle}
          accentColor={accentColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  column: {
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surface,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  chipLabelSelected: {
    color: Colors.textInverse,
  },
});
