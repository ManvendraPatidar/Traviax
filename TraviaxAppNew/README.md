# Traviax - Travel Planning Mobile App

A comprehensive React Native mobile application for travel planning, exploration, and social sharing. Discover places, plan itineraries, book accommodations, and share your travel experiences with the community.

## Project Overview

Traviax is a feature-rich travel application that combines trip planning with social networking. Users can explore destinations, create custom itineraries, book hotels and activities, interact with travel content through reels, and connect with fellow travelers.

## Features

- **🗺️ Trip Planning**: AI-powered itinerary generation with customizable preferences
- **🏨 Hotel Booking**: Browse and book accommodations with detailed information
- **🎯 Activity Discovery**: Find and book local activities and experiences
- **📱 Social Feed**: Share travel experiences through posts and reels
- **💬 AI Chat Assistant**: Get travel recommendations and planning help
- **🔍 Smart Search**: Explore destinations, hotels, and activities
- **👤 User Profiles**: Track visits, check-ins, and travel statistics
- **🎁 Gift Features**: Send travel-related gifts to other users
- **📍 Place Details**: Comprehensive information about destinations

## Tech Stack

- **Framework**: React Native 0.72.10
- **Language**: TypeScript 4.8.4
- **Runtime**: React 18.2.0
- **Navigation**: Custom navigation system
- **State Management**: React hooks and context
- **HTTP Client**: Fetch API
- **UI Components**: Custom components with React Native core
- **Icons & Graphics**: React Native SVG
- **Storage**: AsyncStorage for local data persistence
- **Styling**: React Native StyleSheet with Linear Gradient support
- **Date Handling**: React Native DateTimePicker
- **Markdown**: React Native Markdown Display
- **Utilities**: Lodash debounce for performance optimization

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 16 or higher
- **npm** or **Yarn**: Package manager
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Java Development Kit (JDK)**: Version 11 or higher
- **Android Studio**: With Android SDK and emulator setup
- **Xcode**: Version 12 or higher (macOS only, for iOS development)
- **Watchman**: For file watching (recommended)
- **CocoaPods**: For iOS dependencies (macOS only)

### Platform-Specific Requirements

#### Android

- Android SDK (API level 21 or higher)
- Android Virtual Device (AVD) or physical device
- USB debugging enabled (for physical device)

#### iOS (macOS only)

- Xcode Command Line Tools
- iOS Simulator or physical iOS device
- Apple Developer account (for device testing)

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd TraviaxAppNew
   ```

2. **Install dependencies**

   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

## Environment Setup

### Android Setup

1. **Configure Android SDK**

   - Open Android Studio
   - Go to SDK Manager and install required SDK versions
   - Set ANDROID_HOME environment variable

2. **Create Virtual Device**

   - Open AVD Manager in Android Studio
   - Create a new virtual device with API level 21+

3. **Enable Developer Options** (Physical Device)
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Enable "USB Debugging" in Developer Options

### iOS Setup (macOS only)

1. **Install Xcode**

   - Download from Mac App Store
   - Install Xcode Command Line Tools: `xcode-select --install`

2. **Configure Simulator**
   - Open Xcode
   - Go to Window > Devices and Simulators
   - Add iOS simulators as needed

## Running the App

### Start Metro Bundler

```bash
npm start
# OR
yarn start
```

### For Android

```bash
npx react-native run-android
# OR
npm run android
# OR
yarn android
```

### For iOS (macOS only)

```bash
npx pod-install && npx react-native run-ios
# OR
npm run ios
# OR
yarn ios
```

## Build/Release Guide

### Android APK/AAB Build

1. **Generate Release APK**

   ```bash
   cd android
   ./gradlew assembleRelease
   ```

   APK location: `android/app/build/outputs/apk/release/app-release.apk`

2. **Generate Release AAB** (for Play Store)
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS Archive (macOS only)

1. **Open in Xcode**

   ```bash
   open ios/TraviaxAppNew.xcworkspace
   ```

2. **Archive for Distribution**
   - Select "Any iOS Device" as target
   - Go to Product > Archive
   - Follow the distribution wizard

#### Gradle Build Issues (Android)

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### Pod Installation Issues (iOS)

```bash
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## Useful Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npx tsc --noEmit

# Clean everything and reinstall
rm -rf node_modules package-lock.json
npm install
```

## API Configuration

The app connects to backend services for data. Update the API endpoints in `src/services/api.ts` as needed:

- BASE URL : `http://103.204.52.50:8006/api/v1`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## Support

For issues and questions:

- Check the troubleshooting section above
- Review React Native documentation
- Check platform-specific setup guides

---

Built with ❤️ using React Native
