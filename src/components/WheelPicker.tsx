import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Radius } from '../theme';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface WheelPickerProps {
  items: (string | number)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  label?: string;
}

export function WheelPicker({ items, selectedIndex, onSelect, style, label }: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const lastHapticIndex = useRef<number>(-1);

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated });
    },
    []
  );

  React.useEffect(() => {
    setTimeout(() => scrollToIndex(selectedIndex, false), 50);
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

    if (clampedIndex !== lastHapticIndex.current) {
      lastHapticIndex.current = clampedIndex;
      Haptics.selectionAsync();
      onSelect(clampedIndex);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    scrollToIndex(clampedIndex);
    onSelect(clampedIndex);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerWrapper}>
        {/* Selection highlight */}
        <View style={styles.selectionHighlight} />

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
        >
          {items.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  index === selectedIndex && styles.itemTextSelected,
                ]}
              >
                {String(item).padStart(2, '0')}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Fade top */}
        <View style={styles.fadeTop} pointerEvents="none" />
        {/* Fade bottom */}
        <View style={styles.fadeBottom} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontFamily: Typography.fontLabel,
    fontSize: Typography.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.trackingWidest,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pickerWrapper: {
    height: PICKER_HEIGHT,
    width: 80,
    overflow: 'hidden',
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceElevated,
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.signalDim,
    borderRadius: 8,
    zIndex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.md,
    color: Colors.textMuted,
  },
  itemTextSelected: {
    fontFamily: Typography.fontHeading,
    fontSize: Typography.lg,
    color: Colors.textPrimary,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    background: 'linear-gradient(to bottom, #F1F3F5, transparent)',
    backgroundColor: 'rgba(241,243,245,0.85)',
    zIndex: 2,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    backgroundColor: 'rgba(241,243,245,0.85)',
    zIndex: 2,
  },
});
