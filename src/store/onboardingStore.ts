import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Sex = 'male' | 'female' | null;
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'ft';
export type Goal = 'build_muscle' | 'lose_fat' | 'recompose' | 'performance' | null;
export type TrainingEnv = 'gym' | 'home' | 'outdoor' | 'mixed' | null;
export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced' | null;
export type DietApproach =
  | 'balanced'
  | 'high_protein'
  | 'mediterranean'
  | 'keto'
  | 'paleo'
  | 'flexitarian'
  | null;
export type MealTiming =
  | 'standard'
  | 'intermittent_fasting'
  | 'omad'
  | 'calorie_cycling'
  | 'intuitive'
  | null;
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | null;
export type Somatotype = 'ectomorph' | 'mesomorph' | 'endomorph' | null;
export type ChangeVelocity = 'steady' | 'balanced' | 'intensive' | null;
export type SubscriptionTier = 'free' | 'monthly' | 'yearly' | null;

export type FocusZone =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'glutes'
  | 'legs';

export type InjuryZone =
  | 'shoulders'
  | 'knees'
  | 'lower_back'
  | 'upper_back'
  | 'hips'
  | 'neck'
  | 'ankles'
  | 'wrists';

export type TrainingDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

// ─── State ───────────────────────────────────────────────────────────────────

export interface OnboardingData {
  // Biometrics
  name: string;
  email: string;
  sex: Sex;
  dob: { day: number; month: number; year: number } | null;
  age: number | null;
  height: number; // always stored in cm
  weight: number; // always stored in kg
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;

  // Targets
  goal: Goal;
  focusZones: FocusZone[];
  trainingDays: TrainingDay[];
  sessionDuration: 30 | 45 | 60 | 90;
  trainingEnv: TrainingEnv;
  experienceLevel: ExperienceLevel;
  dietApproach: DietApproach;
  mealTiming: MealTiming;
  activityLevel: ActivityLevel;
  somatotype: Somatotype;
  injuryZones: InjuryZone[];
  injuryFree: boolean;
  changeVelocity: ChangeVelocity;
  targetWeight: number; // kg
  notificationsEnabled: boolean;
  subscriptionTier: SubscriptionTier;

  // Navigation
  currentScreen: number;
  onboardingComplete: boolean;
}

interface OnboardingActions {
  // Setters
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setSex: (sex: Sex) => void;
  setDob: (dob: { day: number; month: number; year: number }) => void;
  setHeight: (height: number) => void;
  setWeight: (weight: number) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  setHeightUnit: (unit: HeightUnit) => void;
  setGoal: (goal: Goal) => void;
  toggleFocusZone: (zone: FocusZone) => void;
  toggleTrainingDay: (day: TrainingDay) => void;
  setSessionDuration: (duration: 30 | 45 | 60 | 90) => void;
  setTrainingEnv: (env: TrainingEnv) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setDietApproach: (approach: DietApproach) => void;
  setMealTiming: (timing: MealTiming) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setSomatotype: (type: Somatotype) => void;
  toggleInjuryZone: (zone: InjuryZone) => void;
  setInjuryFree: (free: boolean) => void;
  setChangeVelocity: (velocity: ChangeVelocity) => void;
  setTargetWeight: (weight: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  setCurrentScreen: (screen: number) => void;
  completeOnboarding: () => void;
  reset: () => void;

  // Computed
  computeCalories: () => number;
  computeMacros: () => { protein: number; carbs: number; fats: number };
  computeTargetDate: () => string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Mifflin-St Jeor BMR */
function calcBMR(sex: Sex, weight: number, height: number, age: number): number {
  if (sex === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  // default male
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

const GOAL_ADJUSTMENTS: Record<string, number> = {
  build_muscle: 300,
  lose_fat: -500,
  recompose: 0,
  performance: 200,
};

const DIET_MACROS: Record<string, { protein: number; carbs: number; fats: number }> = {
  balanced: { protein: 0.3, carbs: 0.45, fats: 0.25 },
  high_protein: { protein: 0.4, carbs: 0.4, fats: 0.2 },
  mediterranean: { protein: 0.25, carbs: 0.45, fats: 0.3 },
  keto: { protein: 0.3, carbs: 0.05, fats: 0.65 },
  paleo: { protein: 0.35, carbs: 0.3, fats: 0.35 },
  flexitarian: { protein: 0.28, carbs: 0.47, fats: 0.25 },
};

const VELOCITY_RATES: Record<string, number> = {
  steady: 0.25,
  balanced: 0.5,
  intensive: 0.75,
};

function ageFromDob(dob: { day: number; month: number; year: number }): number {
  const today = new Date();
  let age = today.getFullYear() - dob.year;
  const m = today.getMonth() + 1 - dob.month;
  if (m < 0 || (m === 0 && today.getDate() < dob.day)) age--;
  return age;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: OnboardingData = {
  name: '',
  email: '',
  sex: null,
  dob: null,
  age: null,
  height: 175,
  weight: 75,
  weightUnit: 'kg',
  heightUnit: 'cm',
  goal: null,
  focusZones: [],
  trainingDays: [],
  sessionDuration: 60,
  trainingEnv: null,
  experienceLevel: null,
  dietApproach: null,
  mealTiming: null,
  activityLevel: null,
  somatotype: null,
  injuryZones: [],
  injuryFree: true,
  changeVelocity: null,
  targetWeight: 70,
  notificationsEnabled: false,
  subscriptionTier: null,
  currentScreen: 0,
  onboardingComplete: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useOnboardingStore = create<OnboardingData & OnboardingActions>((set, get) => ({
  ...initialState,

  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setSex: (sex) => set({ sex }),
  setDob: (dob) => {
    const age = ageFromDob(dob);
    set({ dob, age });
  },
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  setWeightUnit: (weightUnit) => set({ weightUnit }),
  setHeightUnit: (heightUnit) => set({ heightUnit }),
  setGoal: (goal) => set({ goal }),
  toggleFocusZone: (zone) =>
    set((state) => ({
      focusZones: state.focusZones.includes(zone)
        ? state.focusZones.filter((z) => z !== zone)
        : [...state.focusZones, zone],
    })),
  toggleTrainingDay: (day) =>
    set((state) => ({
      trainingDays: state.trainingDays.includes(day)
        ? state.trainingDays.filter((d) => d !== day)
        : [...state.trainingDays, day],
    })),
  setSessionDuration: (sessionDuration) => set({ sessionDuration }),
  setTrainingEnv: (trainingEnv) => set({ trainingEnv }),
  setExperienceLevel: (experienceLevel) => set({ experienceLevel }),
  setDietApproach: (dietApproach) => set({ dietApproach }),
  setMealTiming: (mealTiming) => set({ mealTiming }),
  setActivityLevel: (activityLevel) => set({ activityLevel }),
  setSomatotype: (somatotype) => set({ somatotype }),
  toggleInjuryZone: (zone) =>
    set((state) => ({
      injuryZones: state.injuryZones.includes(zone)
        ? state.injuryZones.filter((z) => z !== zone)
        : [...state.injuryZones, zone],
    })),
  setInjuryFree: (injuryFree) => set({ injuryFree, injuryZones: injuryFree ? [] : get().injuryZones }),
  setChangeVelocity: (changeVelocity) => set({ changeVelocity }),
  setTargetWeight: (targetWeight) => set({ targetWeight }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setSubscriptionTier: (subscriptionTier) => set({ subscriptionTier }),
  setCurrentScreen: (currentScreen) => set({ currentScreen }),
  completeOnboarding: () => set({ onboardingComplete: true }),
  reset: () => set({ ...initialState }),

  computeCalories: () => {
    const { sex, weight, height, age, activityLevel, goal } = get();
    const safeAge = age ?? 25;
    const bmr = calcBMR(sex, weight, height, safeAge);
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel ?? 'sedentary'] ?? 1.2;
    const tdee = bmr * multiplier;
    const adjustment = GOAL_ADJUSTMENTS[goal ?? 'balanced'] ?? 0;
    return Math.round(tdee + adjustment);
  },

  computeMacros: () => {
    const calories = get().computeCalories();
    const ratios = DIET_MACROS[get().dietApproach ?? 'balanced'];
    return {
      protein: Math.round((calories * ratios.protein) / 4),
      carbs: Math.round((calories * ratios.carbs) / 4),
      fats: Math.round((calories * ratios.fats) / 9),
    };
  },

  computeTargetDate: () => {
    const { weight, targetWeight, changeVelocity } = get();
    const diff = Math.abs(weight - targetWeight);
    const rate = VELOCITY_RATES[changeVelocity ?? 'balanced'];
    const weeks = diff / rate;
    const target = new Date();
    target.setDate(target.getDate() + Math.round(weeks * 7));
    return target.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  },
}));
