// Template configuration file
// This file defines the placeholders and default values for the template
export const TEMPLATE_CONFIG = {
  // App Information
  APP_NAME: "My React Native App",
  APP_SLUG: "my-react-native-app",
  APP_DESCRIPTION: "A React Native app with Expo and Tamagui",
  APP_VERSION: "1.0.0",

  // App Icon/Branding
  APP_EMOJI: "📱", // Default app emoji
  APP_COLOR: "$blue9", // Default Tamagui color

  // Bundle Identifiers (you'll need to replace these)
  IOS_BUNDLE_ID: "com.yourcompany.yourapp",
  ANDROID_PACKAGE: "com.yourcompany.yourapp",

  // Company Info
  COMPANY_NAME: "Your Company",

  // EAS Project (you'll need to run eas build:configure)
  EAS_PROJECT_ID: "your-eas-project-id",

  // Git Repository
  REPO_URL: "https://github.com/yourusername/your-repo",
} as const;

// Export individual values for easier imports
export const {
  APP_NAME,
  APP_SLUG,
  APP_DESCRIPTION,
  APP_VERSION,
  APP_EMOJI,
  APP_COLOR,
  IOS_BUNDLE_ID,
  ANDROID_PACKAGE,
  COMPANY_NAME,
  EAS_PROJECT_ID,
  REPO_URL,
} = TEMPLATE_CONFIG;
