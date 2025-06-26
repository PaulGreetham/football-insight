# Football Insight ⚽

A modern mobile application built with Expo, TypeScript, and Tailwind CSS for football insights and analytics.

## 🚀 Tech Stack

- **Framework**: Expo SDK (React Native)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via NativeWind)
- **Platform**: Mobile-only (iOS & Android)

## 📱 Features

- Modern mobile-first design
- Cross-platform compatibility (iOS & Android)
- Type-safe development with TypeScript
- Utility-first CSS with Tailwind CSS
- Hot reloading for fast development

## 🛠️ Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go app](https://expo.dev/client) on your mobile device

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/PaulGreetham/football-insight.git
   cd football-insight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator / `a` for Android emulator

## 📁 Project Structure

```
football-insight/
├── components/          # Reusable UI components
├── screens/            # App screens/pages
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── assets/             # Images, fonts, and other assets
├── App.tsx             # Main app component
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration for NativeWind
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── nativewind-env.d.ts # NativeWind type declarations
```

## 🎨 Styling with Tailwind CSS

This project uses [NativeWind](https://www.nativewind.dev/) to bring Tailwind CSS to React Native. You can use Tailwind classes directly in your components:

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-blue-500 items-center justify-center">
      <Text className="text-white text-xl font-bold">
        Hello Football Insight!
      </Text>
    </View>
  );
}
```

## 🔧 Development

- **Start development server**: `npx expo start`
- **Run iOS**: `npx expo start --ios`
- **Run Android**: `npx expo start --android`
- **Clear cache**: `npx expo start --clear`

## 📦 Building for Production

- **Build for iOS**: `npx expo build:ios`
- **Build for Android**: `npx expo build:android`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Paul Greetham**
- GitHub: [@PaulGreetham](https://github.com/PaulGreetham)

---

Built with ❤️ for football enthusiasts everywhere! 
