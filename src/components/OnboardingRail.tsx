import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useEffect,
} from 'react-native-reanimated';
import { Colors, Typography, PhaseColors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export type RailPhase = 'identity' | 'goals' | 'blueprint' | 'theater' | 'reveal' | 'launch';

const PHASES: { id: RailPhase; label: string; screens: number[] }[] = [
  { id: 'identity', label: 'IDENTITY', screens: [0, 1, 2, 3, 4] },
  { id: 'goals', label: 'GOALS', screens: [5, 6, 7, 8, 9, 10, 11, 12] },
  { id: 'blueprint', label: 'BLUEPRINT', screens: [13, 14, 15, 16] },
  { id: 'theater', label: 'THEATER', screens: [17, 18] },
  { id: 'reveal', label: 'REVEAL', screens: [19, 20, 21] },
  { id: 'launch', label: 'LAUNCH', screens: [22, 23, 24, 25, 26] },
];

function getPhaseFromScreen(screen: number): RailPhase {
  for (const phase of PHASES) {
    if (phase.screens.includes(screen)) return phase.id;
  }
  return 'identity';
}

function PulseRing({ color }: { color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.6, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(withTiming(0, { duration: 900 }), withTiming(0.6, { duration: 900 })),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: color,
        },
      ]}
    />
  );
}

interface OnboardingRailProps {
  currentScreen: number;
  style?: StyleProp<ViewStyle>;
}

export function OnboardingRail({ currentScreen, style }: OnboardingRailProps) {
  const activePhase = getPhaseFromScreen(currentScreen);
  const activePhaseIndex = PHASES.findIndex((p) => p.id === activePhase);

  return (
    <View style={[styles.container, style]}>
      {PHASES.map((phase, index) => {
        const isCompleted = index < activePhaseIndex;
        const isActive = index === activePhaseIndex;
        const color = PhaseColors[phase.id];

        return (
          <React.Fragment key={phase.id}>
            {/* Node */}
            <View style={styles.nodeWrapper}>
              <View
                style={[
                  styles.node,
                  isCompleted && { backgroundColor: color, borderColor: color },
                  isActive && { borderColor: color, borderWidth: 2 },
                ]}
              >
                {isCompleted && (
                  <Ionicons name="checkmark" size={10} color={Colors.white} />
                )}
                {isActive && <PulseRing color={color} />}
              </View>
              <Text
                style={[
                  styles.nodeLabel,
                  isActive && { color, fontFamily: Typography.fontHeading },
                  isCompleted && { color: Colors.textMuted },
                ]}
              >
                {phase.label}
              </Text>
            </View>

            {/* Connector */}
            {index < PHASES.length - 1 && (
              <View style={styles.connector}>
                <View
                  style={[
                    styles.connectorFill,
                    {
                      backgroundColor: isCompleted ? color : Colors.borderSubtle,
                      width: isCompleted ? '100%' : '0%',
                    },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  nodeWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  node: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLabel: {
    fontFamily: Typography.fontBody,
    fontSize: 7,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  connector: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.borderSubtle,
    marginTop: 9,
    overflow: 'hidden',
  },
  connectorFill: {
    height: '100%',
  },
});
