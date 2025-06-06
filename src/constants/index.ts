// App configuration
export const APP_CONFIG = {
  name: 'Acorn Pups Mobile',
  version: '1.0.0',
  description: 'React Native app with Expo and Tamagui',
} as const

// Theme constants
export const THEME = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const 