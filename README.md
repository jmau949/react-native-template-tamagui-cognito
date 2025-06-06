# Acorn Pups Mobile

A production-ready React Native app built with Expo and Tamagui

## 🚀 Features

- **React Native with Expo SDK 53** - Latest stable version with TypeScript support
- **Tamagui UI System** - Modern, performant UI components with built-in theming

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, typography)
│   ├── forms/           # Ready for form components
│   ├── layout/          # Layout components (containers, cards)
│   └── ErrorBoundary.tsx # Production error handling
├── screens/             # Screen components (HomeScreen ready)
├── navigation/          # Ready for navigation setup
├── hooks/               # Ready for custom React hooks
├── utils/               # Ready for utility functions
├── types/               # TypeScript type definitions
├── constants/           # App constants and configuration
├── services/            # Ready for API calls and external services
├── providers/           # Tamagui provider setup
└── tamagui.config.ts    # Tamagui configuration
```

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

- Opens in your default browser
- Great for UI development and testing

### Development Commands

```bash
# Start development server (with QR code for mobile)
npm start

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

### Ready-to-Use Components

- **Button** - Primary, secondary, and outline variants
- **Typography** - Heading1, Heading2, Heading3, BodyText, Caption
- **Container** - Flexible layout container with padding and alignment
- **Card** - Elevated card component for content grouping
- **ErrorBoundary** - Automatic error handling

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
EXPO_PUBLIC_API_URL=your-api-url-here
```

## 🆘 Troubleshooting

### Common Issues

1. **Can't connect iPhone to dev server**

   - Ensure both devices are on same WiFi network
   - Try restarting the dev server: `npm run start:clear`
   - Check Windows Firewall isn't blocking the connection

2. **Metro bundler issues**

   ```bash
   npm run start:clear
   ```

3. **TypeScript errors**

   ```bash
   npm run type-check
   ```

4. **Dependencies issues**
   ```bash
   npm run clean
   ```

### iPhone-Specific Tips

- **Shake device** to access developer menu
- **Two-finger tap** to inspect elements
- **Use Expo Go settings** to switch between projects
- **Enable airplane mode briefly** if connection issues persist
