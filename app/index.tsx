import { Redirect } from 'expo-router';
import { useOnboardingStore } from '../src/store/onboardingStore';

/**
 * Root entry point.
 * - If onboarding is complete → auth/success (dashboard)
 * - Otherwise → start the cold-open splash
 */
export default function Index() {
  const { onboardingComplete } = useOnboardingStore();

  if (onboardingComplete) {
    return <Redirect href="/auth/success" />;
  }

  return <Redirect href="/onboarding/00-cold-open" />;
}
