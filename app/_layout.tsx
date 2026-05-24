import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet } from 'react-native';
import { Colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.void },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/00-cold-open" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding/01-welcome" />
        <Stack.Screen name="onboarding/02-account-gate" />
        <Stack.Screen name="onboarding/03-biological-signals" />
        <Stack.Screen name="onboarding/04-body-frame" />
        <Stack.Screen name="onboarding/05-mission" />
        <Stack.Screen name="onboarding/06-focus-zones" />
        <Stack.Screen name="onboarding/07-training-rhythm" />
        <Stack.Screen name="onboarding/08-environment" />
        <Stack.Screen name="onboarding/09-experience" />
        <Stack.Screen name="onboarding/10-diet-approach" />
        <Stack.Screen name="onboarding/11-meal-timing" />
        <Stack.Screen name="onboarding/12-activity-level" />
        <Stack.Screen name="onboarding/13-somatotype" />
        <Stack.Screen name="onboarding/14-injury-check" />
        <Stack.Screen name="onboarding/15-velocity" />
        <Stack.Screen name="onboarding/16-target-lock" />
        <Stack.Screen
          name="onboarding/17-commitment-bridge"
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="onboarding/18-calibration"
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="onboarding/19-protocol-reveal"
          options={{ animation: 'fade' }}
        />
        <Stack.Screen name="onboarding/20-macro-breakdown" />
        <Stack.Screen name="onboarding/21-feature-flash" />
        <Stack.Screen name="onboarding/24-badge-unlock" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding/25-stay-connected" />
        <Stack.Screen name="onboarding/26-paywall" />
        <Stack.Screen
          name="onboarding/27-trial-confirm"
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="auth/login" />
        <Stack.Screen
          name="auth/success"
          options={{ animation: 'fade', gestureEnabled: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
