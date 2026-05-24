import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography } from '../theme';

const TICK_SPACING = 12;
const RULER_HEIGHT = 80;

interface SwipeRulerProps {
  min?: number;
  max?: number;
  value: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function SwipeRuler({
  min = 30,
  max = 200,
  value,
  step = 1,
  unit = 'kg',
  onChange,
  accentColor = Colors.signal,
  style,
}: SwipeRulerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const lastHapticValue = useRef<number>(-1);
  const range = max - min;
  const totalTicks = range / step;

  const scrollToValue = useCallback(
    (v: number, animated = false) => {
      const index = (v - min) / step;
      scrollRef.current?.scrollTo({ x: index * TICK_SPACING, animated });
    },
    [min, step]
  );

  React.useEffect(() => {
    setTimeout(() => scrollToValue(value, false), 100);
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const rawValue = min + Math.round(offsetX / TICK_SPACING) * step;
    const clampedValue = Math.max(min, Math.min(rawValue, max));

    if (clampedValue !== lastHapticValue.current) {
      lastHapticValue.current = clampedValue;
      Haptics.selectionAsync();
      onChange(clampedValue);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const rawValue = min + Math.round(offsetX / TICK_SPACING) * step;
    const clampedValue = Math.max(min, Math.min(rawValue, max));
    scrollToValue(clampedValue, true);
    onChange(clampedValue);
  };

  const ticks = Array.from({ length: totalTicks + 1 }, (_, i) => min + i * step);

  return (
    <View style={[styles.container, style]}>
      {/* Center indicator */}
      <View style={[styles.centerLine, { backgroundColor: accentColor }]} />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={TICK_SPACING}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {ticks.map((tick) => {
          const isMajor = (tick - min) % 5 === 0;
          const isCurrent = tick === value;
          return (
            <View key={tick} style={[styles.tickWrapper, { width: TICK_SPACING }]}>
              <View
                style={[
                  styles.tick,
                  isMajor ? styles.tickMajor : styles.tickMinor,
                  isCurrent && { backgroundColor: accentColor },
                ]}
              />
              {isMajor && (
                <Text
                  style={[
                    styles.tickLabel,
                    isCurrent && { color: accentColor, fontFamily: Typography.fontHeading },
                  ]}
                >
                  {tick}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Value readout */}
      <View style={styles.readout}>
        <Text style={[styles.readoutValue, { color: accentColor }]}>{value}</Text>
        <Text style={styles.readoutUnit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: RULER_HEIGHT + 60,
    alignItems: 'center',
  },
  centerLine: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 40,
    zIndex: 2,
    borderRadius: 1,
  },
  scrollContent: {
    paddingHorizontal: '50%' as any,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 0,
  },
  tickWrapper: {
    alignItems: 'center',
    height: RULER_HEIGHT,
    justifyContent: 'flex-start',
  },
  tick: {
    width: 1.5,
    borderRadius: 1,
    backgroundColor: Colors.borderSubtle,
  },
  tickMajor: {
    height: 32,
  },
  tickMinor: {
    height: 18,
  },
  tickLabel: {
    fontFamily: Typography.fontBody,
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  readout: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 8,
  },
  readoutValue: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography['4xl'],
  },
  readoutUnit: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.md,
    color: Colors.textMuted,
  },
});
