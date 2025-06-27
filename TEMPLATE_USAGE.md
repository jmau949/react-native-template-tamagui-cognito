# 📋 Template Usage Guide

This guide will help you set up this React Native template for your specific project.

## 🚀 Quick Setup

### 1. Use This Template

Click **"Use this template"** button on GitHub to create a new repository, or clone this repository:

```bash
git clone https://github.com/yourusername/react-native-template-tamagui-cognito.git your-project-name
cd your-project-name
```

### 2. Run Setup Script

You can use the automated setup script:

```bash
./setup-template.sh --app-name "Your Amazing App" --app-slug "your-amazing-app" --ios-bundle-id "com.yourcompany.yourapp" --android-package "com.yourcompany.yourapp"
```

### 3. Manual Setup (Alternative)

If you prefer manual setup:

#### Update `template.config.ts`

```typescript
export const TEMPLATE_CONFIG = {
  // App Information
  APP_NAME: "Your Amazing App",
  APP_SLUG: "your-amazing-app",
  APP_DESCRIPTION: "Your app description here",
  APP_VERSION: "1.0.0",

  // App Icon/Branding
  APP_EMOJI: "🚀", // Choose your app's emoji
  APP_COLOR: "$blue9", // Tamagui color token

  // Bundle Identifiers
  IOS_BUNDLE_ID: "com.yourcompany.yourapp",
  ANDROID_PACKAGE: "com.yourcompany.yourapp",

  // Company Info
  COMPANY_NAME: "Your Company Name",

  // These will be configured later
  EAS_PROJECT_ID: "your-eas-project-id",
  REPO_URL: "https://github.com/yourusername/your-repo",
};
```

#### Update `app.json`

```json
{
  "expo": {
    "name": "Your Amazing App",
    "slug": "your-amazing-app",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    }
  }
}
```

#### Update `package.json`

```json
{
  "name": "your-amazing-app",
  "description": "Your app description here"
}
```

## 🎨 Customization

### App Icons

Replace the following files in the `assets/` folder:

- `icon.png` - App icon (1024x1024)
- `adaptive-icon.png` - Android adaptive icon foreground (1024x1024)
- `splash-icon.png` - Splash screen icon (1024x1024)
- `favicon.png` - Web favicon (32x32 or 16x16)

### App Colors and Theming

1. **Update `template.config.ts`** - Change `APP_COLOR` to your brand color
2. **Customize `src/tamagui.config.ts`** - Add custom colors and themes
3. **Modify `src/constants/theme.ts`** - Add additional theme constants

### Bundle Identifiers

**Important**: Make sure your bundle identifiers are unique:

- **iOS**: `com.yourcompany.yourapp` (reverse domain notation)
- **Android**: Same format as iOS

These must be globally unique across app stores.

## 🏗️ EAS Build Setup

1. **Install EAS CLI** (if not already installed):

   ```bash
   npm install -g @expo/cli eas-cli
   ```

2. **Login to Expo**:

   ```bash
   eas login
   ```

3. **Configure EAS builds**:

   ```bash
   eas build:configure
   ```

4. **Update `template.config.ts`** with your EAS project ID from the generated `app.json`

## 🚀 Development Workflow

### Initial Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Building for Devices

```bash
# Development builds
eas build --platform ios --profile development
eas build --platform android --profile development

# Production builds
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Deployment

```bash
# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

## 📝 Checklist

Use this checklist to ensure you've completed all setup steps:

### Basic Configuration

- [ ] Updated `template.config.ts` with your app details
- [ ] Updated `app.json` with your app name and bundle ID
- [ ] Updated `package.json` with your project details
- [ ] Replaced app icons in `assets/` folder

### Build Configuration

- [ ] Installed EAS CLI
- [ ] Logged into Expo account
- [ ] Ran `eas build:configure`
- [ ] Updated EAS project ID in configuration

### Development

- [ ] Installed dependencies (`npm install`)
- [ ] Started development server (`npm start`)
- [ ] Created development builds for testing
- [ ] Tested on physical devices

### Production Ready

- [ ] Customized app icons and branding
- [ ] Created production builds
- [ ] Prepared for app store submission

## 🆘 Common Issues

### Bundle Identifier Conflicts

If you get bundle identifier errors:

1. Make sure your bundle ID is unique
2. Check Apple Developer account settings
3. Verify EAS configuration

### Build Failures

If builds are failing:

1. Try `eas build --clear-cache`
2. Check EAS build logs for specific errors
3. Verify all configuration files are correct

## 📚 Next Steps

After setup is complete:

1. **Add Features** - Start building your app-specific features
2. **Customize UI** - Modify themes and add custom components
3. **Add Services** - Integrate databases, APIs, and other services
4. **Testing** - Add unit tests and end-to-end testing
5. **CI/CD** - Set up continuous integration and deployment

## 🤝 Contributing Back

If you make improvements to the template that would benefit others:

1. Fork the original template repository
2. Create a feature branch with your improvements
3. Submit a pull request

---

**Happy building! 🚀**
