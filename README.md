# 🥜 Acorn Pups Mobile

A production-ready React Native app built with Expo and Tamagui, featuring comprehensive error handling and modern inline feedback patterns.

**⚠️ Note: This app uses native binaries and requires EAS development builds. It cannot run on Expo Go.**

## ✨ Features

### 🎨 UI & Design

- **Tamagui Integration** - Modern, performant UI components with atomic CSS
- **Inline Feedback** - Context-aware error messages and success states
- **Responsive Design** - Optimized for all screen sizes

### 🔒 Authentication

- **AWS Cognito** - Secure user authentication
- **Complete Auth Flow** - Sign up, sign in, forgot password, email verification
- **Contextual Feedback** - Inline validation and error states

### 🛡️ Error Handling

- **Comprehensive Logging** - Structured error tracking and analytics
- **Graceful Degradation** - User-friendly error boundaries
- **Smart Retry Logic** - Automatic recovery for transient failures

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLifecycleManager.tsx
│   └── ErrorBoundary.tsx
├── config/
│   └── aws-config.ts
├── constants/
│   ├── appConfig.ts
│   └── theme.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useErrorHandler.ts
│   └── useToast.ts        # Removed - replaced with inline feedback
├── navigation/
│   ├── AppStack.tsx
│   ├── AuthStack.tsx
│   └── RootNavigator.tsx
├── providers/
│   └── AuthProvider.tsx
├── screens/
│   ├── auth/
│   │   ├── ConfirmResetPasswordScreen.tsx
│   │   ├── ConfirmSignUpScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── WelcomeScreen.tsx
│   └── HomeScreen.tsx
├── services/
│   └── auth.ts
├── types/
│   ├── auth.ts
│   ├── common.ts
│   ├── errors.ts
│   └── navigation.ts
└── utils/
    ├── asyncErrorHandler.ts
    └── errorLogger.ts
```

The app follows a clean, modular architecture with clear separation of concerns. All UI components use Tamagui for consistency, error boundaries, and inline feedback patterns that keep users focused on their tasks.

#### Environment Differences

- **Development**: Full error details, console logging, detailed boundaries
- **Production**: User-friendly messages, error queuing, minimal UI

#### Remote Logging Setup (Sentry-Ready)

```typescript
import * as Sentry from "@sentry/react-native";

// Configure in errorLogger.ts
if (!__DEV__) {
  Sentry.captureException(error, {
    tags: { category, severity },
    contexts: { errorContext: context },
  });
}
```

### Performance

**Zero Performance Impact Design:**

- ✅ Asynchronous error logging
- ✅ Optimized toast rendering via Tamagui
- ✅ Error throttling prevents spam
- ✅ Memory management with queue limits

## 🛠 Development Setup

### Prerequisites

1. **Install Node.js** (v18 or later)
2. **Install Expo CLI and EAS CLI**
   ```powershell
   npm install -g @expo/cli eas-cli
   ```
3. **Create Expo account** at [expo.dev](https://expo.dev) if you don't have one
4. **Clone and setup project**
   ```powershell
   git clone <repository-url>
   cd acorn-pups-mobile
   npm install
   ```

### Initial EAS Setup

1. **Login to Expo** - Authenticates your CLI with your Expo account

   ```powershell
   eas login
   ```

2. **Configure EAS builds** - Creates `eas.json` configuration file for build profiles (development, production, etc.)
   ```powershell
   eas build:configure
   ```

## 📱 iOS Development Setup

### Step 1: Apple Developer Account Setup

1. **Apple Developer Account** - You need a paid Apple Developer account ($99/year)
2. **Add your Apple ID** to EAS - Links your Apple Developer account for device registration and certificate management:
   ```powershell
   eas device:create
   ```

### Step 2: Register Your iOS Device

1. **Find your device UDID**:

   - Connect your iPhone to a Mac and open Finder, or
   - Use a UDID finder website, or
   - Use this command to generate a registration URL:

   ```powershell
   eas device:create
   ```

   - Open the generated URL on your iOS device and follow instructions
     This automatically registers your device's UDID with your Apple Developer account

2. **Verify device registration** - Lists all registered devices to confirm your device was added:
   ```powershell
   eas device:list
   ```
   Your device should appear in this list.

### Step 3: Build and Install Development Build

1. **Create iOS development build** - Builds the app with development profile (includes debugging tools):
   ```powershell
   eas build --platform ios --profile development
   ```
2. **Wait for build to complete** (usually 10-20 minutes)

3. **Install on device**:
   - Open the build URL on your iPhone
   - Follow the installation prompts
   - Trust the developer certificate in Settings > General > VPN & Device Management

### Step 4: Start Development

1. **Start the development server**:

   ```powershell
   npm start
   ```

2. **Open the development build** on your iPhone and scan the QR code or enter the URL manually

## 🤖 Android Development Setup

### Option 1: Physical Android Device (Recommended)

#### Step 1: Prepare Your Android Device

1. **Enable Developer Options**:

   - Go to Settings > About phone
   - Tap "Build number" 7 times
   - Developer options will appear in Settings

2. **Enable USB Debugging**:

   - Go to Settings > Developer options
   - Enable "USB debugging"

3. **Connect device to PC**:
   - Use USB cable
   - Allow USB debugging when prompted

#### Step 2: Build and Install

1. **Create Android development build** - Builds the APK with development profile (includes debugging tools):

   ```powershell
   eas build --platform android --profile development
   ```

2. **Install the APK**:
   - Download the APK from the build URL
   - Install on your device (may need to allow installing from unknown sources)

#### Step 3: Start Development

1. **Start the development server**:

   ```powershell
   npm start
   ```

2. **Open the development build** on your Android device and scan the QR code

### Option 2: Android Emulator

#### Step 1: Install Android Studio

1. **Download Android Studio** from [developer.android.com](https://developer.android.com/studio)
2. **Install Android SDK** and create a virtual device
3. **Add Android SDK to PATH** (usually in `%LOCALAPPDATA%\Android\Sdk`)

#### Step 2: Create and Start Emulator

1. **Open Android Studio** > AVD Manager
2. **Create a new virtual device** (recommended: Pixel 6 with API 33+)
3. **Start the emulator**

#### Step 3: Build and Install

1. **Create Android development build** - Builds the APK with development profile (includes debugging tools):

   ```powershell
   eas build --platform android --profile development
   ```

2. **Install on emulator** - Uses Android Debug Bridge to install the APK on running emulator:
   ```powershell
   adb install path/to/downloaded-build.apk
   ```

## 🔧 Development Commands

```powershell
# Start development server - Starts Metro bundler for hot reloading
npm start

# Start with cleared cache - Clears Metro cache and starts fresh
npm run start:clear

# Create development builds - Builds with debugging tools enabled
eas build --platform ios --profile development
eas build --platform android --profile development

# Create production builds - Builds optimized for app store submission
eas build --platform ios --profile production
eas build --platform android --profile production

# Check build status - Lists all your builds and their current status
eas build:list

# Type checking - Runs TypeScript compiler to check for type errors
npm run type-check

# Clean and reinstall dependencies - Removes node_modules and reinstalls
npm run clean
```

## 🚀 Production Builds

### iOS Production

1. **Ensure App Store Connect setup**:

   - App Store Connect account
   - App identifier registered
   - Certificates and profiles configured

2. **Create production build** - Builds optimized version for App Store submission:

   ```powershell
   eas build --platform ios --profile production
   ```

3. **Submit to App Store** - Automatically uploads your build to App Store Connect:
   ```powershell
   eas submit --platform ios
   ```

### Android Production

1. **Create production build** - Builds signed APK/AAB for Google Play Store:

   ```powershell
   eas build --platform android --profile production
   ```

2. **Submit to Google Play** - Automatically uploads your build to Google Play Console:
   ```powershell
   eas submit --platform android
   ```

## 🆘 Troubleshooting

### iOS Issues

1. **Device not registered** - Register your device and verify it's added:

   ```powershell
   eas device:create  # Creates device registration URL
   eas device:list    # Lists all registered devices
   ```

2. **Certificate issues**:

   - Check Apple Developer account status
   - Verify device is registered
   - Try `eas build --clear-cache` - Clears build cache and regenerates certificates

3. **Installation failed**:
   - Trust developer certificate in iOS Settings
   - Check device storage space
   - Verify device UDID is correct

### Android Issues

1. **APK won't install**:

   - Enable "Install unknown apps" for your browser
   - Check Android version compatibility
   - Clear space on device

2. **USB debugging not working**:

   - Try different USB cable
   - Restart adb: `adb kill-server && adb start-server`
   - Check Windows drivers for your device

3. **Emulator issues**:
   - Ensure hardware acceleration is enabled
   - Increase emulator RAM in AVD settings
   - Try different API level

### General Issues

1. **Build failures** - Clear build cache and try again:

   ```powershell
   eas build --clear-cache --platform [ios|android] --profile development
   ```

2. **Metro bundler issues** - Clear Metro cache and restart:

   ```powershell
   npm run start:clear
   ```

3. **Dependency issues** - Clean install all dependencies:
   ```powershell
   npm run clean
   ```

## 📋 Quick Start Checklist

### For iOS Development:

- [ ] Apple Developer account ($99/year)
- [ ] EAS CLI installed
- [ ] Device registered with `eas device:create`
- [ ] Development build created and installed
- [ ] Development server running

### For Android Development:

- [ ] Android device with USB debugging enabled, OR
- [ ] Android Studio with emulator set up
- [ ] Development build created and installed
- [ ] Development server running

## 🔐 Environment Variables

Create an `env.js` file based on `env.example.js`:

```javascript
export default {
  EXPO_PUBLIC_API_URL: "your-api-url-here",
  EXPO_PUBLIC_SENTRY_DSN: "your-sentry-dsn-here",
};
```

## 🎨 Available Components

### UI Components

- **Button** - Primary, secondary, and outline variants
- **Typography** - Heading1, Heading2, Heading3, BodyText, Caption
- **Container** - Flexible layout container with padding and alignment
- **Card** - Elevated card component for content grouping
- **Toast** - Beautiful notifications with Tamagui styling

### Error Handling Components

- **TamaguiErrorBoundary** - Automatic error handling with beautiful fallback UI
- **Error Hooks** - Component-level error management
- **Toast System** - User-friendly error and success notifications

## 🔐 Authentication

Complete authentication system with:

- **Secure Storage** - Encrypted token storage
- **Auth Screens** - Login, signup, forgot password, etc.
- **Auth Provider** - Global authentication state
- **Protected Routes** - Automatic navigation based on auth state

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contributing guidelines here]
