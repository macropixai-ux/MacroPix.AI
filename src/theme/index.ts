export const Colors = {
  // Backgrounds
  void: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F3F5',
  surfaceGlass: 'rgba(255, 255, 255, 0.75)',

  // Premium Accent Colors
  signal: '#0D9488',
  signalDim: 'rgba(13, 148, 136, 0.08)',
  signalGlow: 'rgba(13, 148, 136, 0.15)',

  fuel: '#0284C7',
  fuelDim: 'rgba(2, 132, 199, 0.08)',

  burn: '#E11D48',
  burnDim: 'rgba(225, 29, 72, 0.08)',

  power: '#7C3AED',
  powerDim: 'rgba(124, 58, 237, 0.08)',

  // Typography
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Borders
  borderSubtle: 'rgba(0, 0, 0, 0.06)',
  borderActive: 'rgba(13, 148, 136, 0.3)',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.4)',
  error: '#EF4444',
  success: '#10B981',
} as const;

export const Typography = {
  fontDisplay: 'Outfit_700Bold',
  fontHeading: 'Outfit_600SemiBold',
  fontBody: 'Inter_400Regular',
  fontLabel: 'Inter_500Medium',

  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 40,
  '5xl': 52,

  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,

  trackingNormal: 0,
  trackingWide: 0.5,
  trackingWidest: 1.5,
} as const;

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export const Shadows = {
  subtleCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  accentGlow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  }),
} as const;

export const PhaseColors = {
  identity: Colors.signal,
  goals: Colors.fuel,
  blueprint: Colors.power,
  theater: Colors.burn,
  reveal: Colors.signal,
  launch: Colors.fuel,
} as const;

export type Phase = keyof typeof PhaseColors;
