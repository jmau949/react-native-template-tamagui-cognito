# 📱 React Native Template - Tamagui + AWS Cognito

A production-ready React Native template built with Expo, Tamagui, and AWS Cognito authentication. Perfect for quickly starting new mobile apps with a modern, scalable foundation.

**⚠️ Note: This app uses native binaries and requires EAS development builds. It cannot run on Expo Go.**

## ✨ Features

### 🎨 UI & Design

- **Tamagui Integration** - Modern, performant UI components with atomic CSS
- **Responsive Design** - Optimized for all screen sizes and orientations
- **Theme Support** - Built-in light/dark mode capabilities
- **Clean Architecture** - Well-organized, maintainable codebase

### 🔒 Authentication

- **AWS Cognito** - Secure, scalable user authentication
- **Complete Auth Flow** - Sign up, sign in, forgot password, email verification
- **Persistent Sessions** - Users stay logged in across app restarts
- **Error Handling** - Comprehensive error management with user-friendly messages

### 🛡️ Production Ready

- **TypeScript** - Full type safety throughout the application
- **Error Boundaries** - Graceful error handling and recovery
- **Structured Logging** - Built-in error tracking and analytics support
- **EAS Build Ready** - Pre-configured for Expo Application Services

## 🚀 Quick Start

### 1. Use This Template

Click **"Use this template"** on GitHub or clone the repository:

```powershell
git clone https://github.com/yourusername/react-native-template-tamagui-cognito.git
cd react-native-template-tamagui-cognito
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Your App

Update `template.config.ts` with your app details:

```typescript
export const TEMPLATE_CONFIG = {
  APP_NAME: "Your Amazing App",
  APP_SLUG: "your-amazing-app",
  APP_DESCRIPTION: "Your app description",
  APP_EMOJI: "🚀", // Your app's emoji icon
  IOS_BUNDLE_ID: "com.yourcompany.yourapp",
  ANDROID_PACKAGE: "com.yourcompany.yourapp",
  // ... other configuration
};
```

### 4. Update Configuration Files

The template will automatically use your `template.config.ts` values, but you may need to update:

- `app.json` - Expo configuration
- `package.json` - Project metadata
- `eas.json` - EAS build configuration (after running `eas build:configure`)

### 5. Setup AWS Cognito

Follow our [Authentication Guide](./docs/AUTHENTICATION_GUIDE.md) to set up AWS Cognito and configure your authentication.

### 6. Start Development

```powershell
# Install EAS CLI if you haven't already
npm install -g @expo/cli eas-cli

# Login to Expo
eas login

# Configure EAS builds
eas build:configure

# Start development server
npm start
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AppLifecycleManager.tsx
│   └── ErrorBoundary.tsx
├── config/              # Configuration files
│   └── aws-config.ts
├── constants/           # App constants and themes
│   ├── appConfig.ts
│   └── theme.ts
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   └── useErrorHandler.ts
├── navigation/          # Navigation configuration
│   ├── AppStack.tsx
│   ├── AuthStack.tsx
│   └── RootNavigator.tsx
├── providers/           # Context providers
│   └── AuthProvider.tsx
├── screens/            # Screen components
│   ├── auth/
│   │   ├── ConfirmResetPasswordScreen.tsx
│   │   ├── EmailVerificationScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── WelcomeScreen.tsx
│   └── HomeScreen.tsx
├── services/           # External service integrations
│   └── auth.ts
├── types/              # TypeScript type definitions
│   ├── auth.ts
│   ├── common.ts
│   ├── errors.ts
│   └── navigation.ts
└── utils/              # Utility functions
    ├── asyncErrorHandler.ts
    └── errorLogger.ts
```

## 🛠 Development Setup

### Prerequisites

1. **Node.js** (v18 or later)
2. **Expo CLI and EAS CLI**
   ```powershell
   npm install -g @expo/cli eas-cli
   ```
3. **Expo account** at [expo.dev](https://expo.dev)
4. **AWS account** for Cognito setup
5. **Apple Developer account** ($99/year) for iOS development
6. **Android device or emulator** for Android development

### Initial Setup

1. **Clone and install dependencies**

   ```powershell
   git clone <your-repo-url>
   cd your-project-name
   npm install
   ```

2. **Configure your app** by updating `template.config.ts`

3. **Setup AWS Cognito** following the [Authentication Guide](./docs/AUTHENTICATION_GUIDE.md)

4. **Login to Expo and configure EAS**
   ```powershell
   eas login
   eas build:configure
   ```

## 📱 Building & Deployment

### Development Builds

For iOS:

```powershell
eas build --platform ios --profile development
```

For Android:

```powershell
eas build --platform android --profile development
```

### Production Builds

For iOS:

```powershell
eas build --platform ios --profile production
```

For Android:

```powershell
eas build --platform android --profile production
```

### App Store Deployment

```powershell
eas submit --platform ios
eas submit --platform android
```

## 🎨 Customization

### Theming

The template uses Tamagui for theming. Customize your app's appearance in:

- `src/constants/theme.ts` - Theme configuration
- `src/tamagui.config.ts` - Tamagui setup
- `template.config.ts` - App colors and branding

### Adding New Screens

1. Create your screen component in `src/screens/`
2. Add route types to `src/types/navigation.ts`
3. Update navigation stacks in `src/navigation/`

### Adding New Features

The template provides a solid foundation. Common additions:

- **Database integration** (Supabase, Firebase, etc.)
- **Push notifications** (Expo Notifications)
- **Analytics** (Expo Analytics, Firebase Analytics)
- **Crash reporting** (Sentry)
- **State management** (Zustand, Redux Toolkit)

## 🔧 Available Scripts

```powershell
# Development
npm start              # Start development server
npm run start:clear    # Start with cleared cache
npm run android        # Start with Android focus
npm run ios           # Start with iOS focus

# Building
npm run build:android  # Build for Android
npm run build:ios     # Build for iOS
npm run prebuild      # Generate native code

# Code Quality
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript checks
npm test             # Run tests (when added)

# Maintenance
npm run clean         # Clean dependencies
```

## 📚 Documentation

- [Authentication Guide](./docs/AUTHENTICATION_GUIDE.md) - Complete AWS Cognito setup
- [Tamagui Documentation](https://tamagui.dev/) - UI framework
- [Expo Documentation](https://docs.expo.dev/) - Platform and tools
- [React Navigation](https://reactnavigation.org/) - Navigation library

## 🤝 Contributing

This template is designed to be a starting point. If you make improvements that would benefit others:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## 📄 License

This template is open source and available under the [MIT License](LICENSE).

## 🆘 Support

### Template Issues

- Check the [troubleshooting section](./docs/AUTHENTICATION_GUIDE.md#troubleshooting)
- Search [existing issues](https://github.com/yourusername/react-native-template-tamagui-cognito/issues)
- Create a [new issue](https://github.com/yourusername/react-native-template-tamagui-cognito/issues/new)

### Common Problems

1. **Build failures**: Try `eas build --clear-cache`
2. **Metro bundler issues**: Run `npm run start:clear`
3. **Dependency conflicts**: Run `npm run clean`

## 🎯 Roadmap

Future improvements planned:

- [ ] Additional authentication providers (Google, Apple)
- [ ] More UI components and screens
- [ ] Testing setup with Jest/Detox
- [ ] CI/CD pipeline examples
- [ ] More customization options

## ⭐ Acknowledgments

Built with amazing open source projects:

- [Expo](https://expo.dev/) - Development platform
- [Tamagui](https://tamagui.dev/) - UI system
- [React Navigation](https://reactnavigation.org/) - Navigation
- [AWS Amplify](https://aws.amazon.com/amplify/) - Authentication
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**Happy coding! 🚀**

If this template helps you build something amazing, consider giving it a ⭐ on GitHub!
