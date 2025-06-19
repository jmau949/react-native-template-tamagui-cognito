# Acorn Pups Mobile

A production-ready React Native app built with Expo and Tamagui, featuring comprehensive error handling and beautiful toast notifications.

## 🚀 Features

- **React Native with Expo SDK 53** - Latest stable version with TypeScript support
- **Tamagui UI System** - Modern, performant UI components with built-in theming
- **Production-Grade Error Handling** - Comprehensive error capture, logging, and user experience management
- **Beautiful Toast Notifications** - Expo Go compatible toast system using Tamagui
- **Authentication System** - Complete auth flow with secure storage
- **Zero Performance Impact** - Optimized error handling with no runtime overhead

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   └── ErrorBoundary.tsx # Production error handling with Tamagui UI
├── screens/             # Screen components
│   ├── auth/           # Authentication screens
│   └── HomeScreen.tsx  # Main app screen
├── navigation/          # Navigation configuration
├── hooks/               # Custom React hooks
│   ├── useErrorHandler.ts  # Error handling hooks
│   └── useToast.ts        # Toast notification hooks
├── utils/               # Utility functions
│   ├── errorLogger.ts     # Central error logging
│   └── asyncErrorHandler.ts # Async operations with retry logic
├── types/               # TypeScript type definitions
│   └── errors.ts        # Error handling types
├── constants/           # App constants and configuration
├── services/            # API calls and external services
├── providers/           # Context providers
└── tamagui.config.ts    # Tamagui configuration
```

## 🔧 Error Handling System

### Overview

This app features a comprehensive, production-ready error handling system built specifically for Tamagui. The system provides centralized error logging, automatic retry logic, graceful error boundaries, and beautiful Tamagui-based toast notifications that work seamlessly with Expo Go.

### Core Components

#### 1. Error Types

Structured error interfaces with categories, severity levels, and context metadata:

- **Error Categories**: UI_ERROR, API_ERROR, NAVIGATION_ERROR, PERFORMANCE_ERROR
- **Severity Levels**: LOW, MEDIUM, HIGH, CRITICAL
- **Rich Context**: User actions, screen names, metadata

#### 2. Central Error Logger

- **Environment-aware logging**: Console in development, queuing for production
- **Error throttling**: Maximum 3 identical errors per 5 seconds
- **Sentry-compatible format**: Ready for remote logging integration
- **Memory management**: 100 error queue limit with cleanup

#### 3. Tamagui Toast System

**Expo Go Compatible Toast Notifications**

- ✅ **No Native Modules**: Works without compilation
- 🎨 **Tamagui Styled**: Matches your app's design system
- ♿ **Accessible**: Screen reader support built-in
- 📱 **Cross-platform**: iOS, Android, and Web

#### 4. Error Boundary Component

React class component with beautiful Tamagui UI:

- **Graceful fallback interface**: Beautiful error UI with retry functionality
- **Development details**: Shows error stack trace in development mode
- **Custom fallback support**: Override default error UI

#### 5. Error Handler Hooks

Component-level error management with integrated toast notifications:

- `useErrorHandler()`: General error handling
- `useApiErrorHandler()`: API/network operations
- `useNavigationErrorHandler()`: Navigation errors
- `usePerformanceErrorHandler()`: Performance monitoring

### Usage Examples

#### Basic Error Handling

```typescript
import { useErrorHandler } from "@/hooks/useErrorHandler";

const MyComponent = () => {
  const { handleError } = useErrorHandler();

  const handleButtonPress = () => {
    try {
      riskyOperation();
    } catch (error) {
      handleError(error); // Logs + shows toast automatically
    }
  };
};
```

#### API Requests with Retry

```typescript
import { useApiErrorHandler } from "@/hooks/useErrorHandler";

const MyComponent = () => {
  const { handleApiError } = useApiErrorHandler();

  const fetchData = async () => {
    try {
      const result = await handleApiError(
        () => fetch("/api/data").then((r) => r.json()),
        {
          endpoint: "/api/data",
          method: "GET",
          showToast: true,
        }
      );
      return result;
    } catch (error) {
      // Error already logged and toast shown
      console.log("Request failed");
    }
  };
};
```

#### Toast Notifications

```typescript
import { useToast } from "@/hooks/useToast";

const MyComponent = () => {
  const toast = useToast();

  const showNotification = () => {
    toast.showSuccessToast("Profile updated successfully!");
    toast.showErrorToast("Something went wrong");
  };
};
```

#### Error Boundaries

```typescript
import { TamaguiErrorBoundary } from "@/components/ErrorBoundary";

const App = () => (
  <TamaguiErrorBoundary>
    <MyApp />
  </TamaguiErrorBoundary>
);
```

### Production Configuration

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

### For Windows PC Development

1. **Install Expo CLI globally**

   ```bash
   npm install -g @expo/cli
   ```

2. **Clone and setup project**

   ```bash
   git clone <repository-url>
   cd acorn-pups-mobile
   npm install
   ```

3. **Install Expo Go app on your phone**
   - **iPhone**: Download from App Store
   - **Android**: Download from Google Play Store

### For iPhone Testing

#### Option 1: Expo Go App (Recommended for Development)

1. **Install Expo Go** on your iPhone from the App Store
2. **Start the development server**
   ```bash
   npm start
   ```
3. **Connect your iPhone**:
   - Make sure your iPhone and PC are on the same WiFi network
   - Open Expo Go app on your iPhone
   - Scan the QR code from your terminal/browser
   - The app will load on your phone automatically

#### Option 2: iOS Simulator (Requires macOS)

If you have access to a Mac:

1. **Install Xcode** from Mac App Store
2. **Install iOS Simulator**
3. **Run iOS simulator**
   ```bash
   npm run ios
   ```

#### Option 3: Web Browser (Development Testing)

```bash
npm run web
```

### Development Commands

```bash
# Start development server (with QR code for mobile)
# expo go doesnt work with native binaries
npm start

# expo
eas build --platform ios --profile development

npx expo start --dev-client

# Start with cleared cache
npm run start:clear

# Run on Android (requires Android Studio)
npm run android

# Run on iOS (requires macOS and Xcode)
npm run ios

# Run in web browser
npm run web

# Type checking
npm run type-check

# Clean and reinstall dependencies
npm run clean
```

## 📱 Testing on iPhone (Step by Step)

1. **Ensure same network**: Your Windows PC and iPhone must be on the same WiFi network

2. **Start development server**:

   ```bash
   cd acorn-pups-mobile
   npm start
   ```

3. **Open Expo Go** on your iPhone

4. **Scan QR Code**:

   - Point your iPhone camera at the QR code in terminal
   - Or open the QR code link that appears in your browser
   - Tap the notification to open in Expo Go

5. **Development workflow**:
   - Make changes in VS Code on your PC
   - Save files to see instant updates on your iPhone
   - Shake your iPhone to access developer menu
   - Use Chrome DevTools for debugging

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

## 🌍 Environment Variables

Create a `.env` file for environment-specific configuration:

```env
EXPO_PUBLIC_API_URL=your-api-url-here
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
```

## 🆘 Troubleshooting

### Common Issues

1. **Can't connect iPhone to dev server**

   - Ensure both devices are on same WiFi network
   - Try restarting the dev server: `npm run start:clear`
   - Check Windows Firewall isn't blocking the connection

2. **Toast not showing**

   - Ensure `ToastProvider` and `ToastViewport` are in App.tsx
   - Check that `useErrorHandler` is called within component tree
   - Verify `showToast: true` in error options

3. **Metro bundler issues**

   ```bash
   npm run start:clear
   ```

4. **TypeScript errors**

   ```bash
   npm run type-check
   ```

5. **Dependencies issues**
   ```bash
   npm run clean
   ```

### iPhone-Specific Tips

- **Shake device** to access developer menu
- **Two-finger tap** to inspect elements
- **Use Expo Go settings** to switch between projects
- **Enable airplane mode briefly** if connection issues persist

## 🚀 Production Deployment

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Error Monitoring Setup

1. **Configure Sentry** for production error tracking
2. **Set up remote logging** endpoints
3. **Configure error queuing** for offline scenarios
4. **Set environment variables** for production

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contributing guidelines here]
