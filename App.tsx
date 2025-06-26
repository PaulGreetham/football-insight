import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-xl font-bold text-blue-600">
        Welcome to Football Insight!
      </Text>
      <Text className="text-gray-600 mt-4 text-center px-4">
        Your Expo + TypeScript + Tailwind CSS app is ready to go!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
