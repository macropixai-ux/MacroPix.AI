import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Ellipse, Rect, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Typography } from '../theme';

export type BodyZone =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'glutes'
  | 'legs';

interface BodyDiagramProps {
  selectedZones: BodyZone[];
  onToggleZone: (zone: BodyZone) => void;
  view?: 'front' | 'back';
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

const ZONE_LABELS: { id: BodyZone; label: string; emoji: string }[] = [
  { id: 'chest', label: 'Chest', emoji: '💪' },
  { id: 'back', label: 'Back', emoji: '🔙' },
  { id: 'shoulders', label: 'Shoulders', emoji: '🏋️' },
  { id: 'arms', label: 'Arms', emoji: '💪' },
  { id: 'core', label: 'Core', emoji: '🎯' },
  { id: 'glutes', label: 'Glutes', emoji: '🍑' },
  { id: 'legs', label: 'Legs', emoji: '🦵' },
];

const FRONT_ZONES: { id: BodyZone; cx: number; cy: number; label: string }[] = [
  { id: 'chest', cx: 100, cy: 90, label: 'Chest' },
  { id: 'shoulders', cx: 55, cy: 75, label: 'Shoulders' },
  { id: 'arms', cx: 40, cy: 115, label: 'Arms' },
  { id: 'core', cx: 100, cy: 145, label: 'Core' },
  { id: 'legs', cx: 100, cy: 230, label: 'Legs' },
];

const BACK_ZONES: { id: BodyZone; cx: number; cy: number; label: string }[] = [
  { id: 'back', cx: 100, cy: 95, label: 'Back' },
  { id: 'shoulders', cx: 55, cy: 75, label: 'Shoulders' },
  { id: 'arms', cx: 40, cy: 115, label: 'Arms' },
  { id: 'glutes', cx: 100, cy: 185, label: 'Glutes' },
  { id: 'legs', cx: 100, cy: 240, label: 'Legs' },
];

function ZoneCircle({
  cx,
  cy,
  id,
  label,
  isSelected,
  onToggle,
  accentColor,
}: {
  cx: number;
  cy: number;
  id: BodyZone;
  label: string;
  isSelected: boolean;
  onToggle: (id: BodyZone) => void;
  accentColor: string;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(1.3, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.zoneButton,
        {
          left: cx - 28,
          top: cy - 18,
          backgroundColor: isSelected ? accentColor : Colors.surfaceElevated,
          borderColor: isSelected ? accentColor : Colors.borderSubtle,
        },
      ]}
    >
      <Text style={[styles.zoneLabel, isSelected && styles.zoneLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function BodyDiagram({
  selectedZones,
  onToggleZone,
  view = 'front',
  accentColor = Colors.signal,
  style,
}: BodyDiagramProps) {
  const zones = view === 'front' ? FRONT_ZONES : BACK_ZONES;

  return (
    <View style={[styles.container, style]}>
      {/* SVG Body Silhouette */}
      <View style={styles.svgContainer}>
        <Svg width={200} height={320} viewBox="0 0 200 320">
          {/* Head */}
          <Circle cx={100} cy={34} r={24} fill={Colors.surfaceElevated} stroke={Colors.borderSubtle} strokeWidth={1.5} />
          {/* Neck */}
          <Rect x={90} y={56} width={20} height={16} rx={4} fill={Colors.surfaceElevated} stroke={Colors.borderSubtle} strokeWidth={1} />
          {/* Torso */}
          <Path
            d="M60 72 L140 72 L148 175 L52 175 Z"
            fill={Colors.surfaceElevated}
            stroke={Colors.borderSubtle}
            strokeWidth={1.5}
          />
          {/* Left arm */}
          <Path
            d="M60 72 L36 78 L28 155 L44 158 L52 90 Z"
            fill={Colors.surfaceElevated}
            stroke={Colors.borderSubtle}
            strokeWidth={1.5}
          />
          {/* Right arm */}
          <Path
            d="M140 72 L164 78 L172 155 L156 158 L148 90 Z"
            fill={Colors.surfaceElevated}
            stroke={Colors.borderSubtle}
            strokeWidth={1.5}
          />
          {/* Hips */}
          <Ellipse cx={100} cy={178} rx={50} ry={16} fill={Colors.surfaceElevated} stroke={Colors.borderSubtle} strokeWidth={1.5} />
          {/* Left leg */}
          <Path
            d="M72 190 L58 300 L82 302 L94 195 Z"
            fill={Colors.surfaceElevated}
            stroke={Colors.borderSubtle}
            strokeWidth={1.5}
          />
          {/* Right leg */}
          <Path
            d="M128 190 L142 300 L118 302 L106 195 Z"
            fill={Colors.surfaceElevated}
            stroke={Colors.borderSubtle}
            strokeWidth={1.5}
          />

          {/* Highlight selected zones with glow circles */}
          {zones.map((zone) =>
            selectedZones.includes(zone.id) ? (
              <Circle
                key={zone.id}
                cx={zone.cx}
                cy={zone.cy}
                r={22}
                fill={accentColor}
                opacity={0.18}
              />
            ) : null
          )}
        </Svg>

        {/* Interactive zone buttons overlaid */}
        <View style={StyleSheet.absoluteFill}>
          {zones.map((zone) => (
            <ZoneCircle
              key={zone.id}
              cx={zone.cx}
              cy={zone.cy}
              id={zone.id}
              label={zone.label}
              isSelected={selectedZones.includes(zone.id)}
              onToggle={onToggleZone}
              accentColor={accentColor}
            />
          ))}
        </View>
      </View>

      {/* Bottom chip strip */}
      <View style={styles.chipRow}>
        {ZONE_LABELS.map((z) => (
          <TouchableOpacity
            key={z.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggleZone(z.id);
            }}
            style={[
              styles.chip,
              selectedZones.includes(z.id) && {
                backgroundColor: accentColor,
                borderColor: accentColor,
              },
            ]}
          >
            <Text style={[styles.chipText, selectedZones.includes(z.id) && styles.chipTextSelected]}>
              {z.emoji} {z.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  svgContainer: {
    width: 200,
    height: 320,
    position: 'relative',
  },
  zoneButton: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneLabel: {
    fontFamily: Typography.fontLabel,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  zoneLabelSelected: {
    color: Colors.textInverse,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceElevated,
  },
  chipText: {
    fontFamily: Typography.fontBody,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.textInverse,
  },
});
