import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const userStats = [
    { label: 'Articles Read', value: '127' },
    { label: 'Teams Followed', value: '8' },
    { label: 'Saved Articles', value: '23' },
  ];

  const profileOptions = [
    { icon: 'bookmark', label: 'Saved Articles', hasArrow: true },
    { icon: 'heart', label: 'Favorite Teams', hasArrow: true },
    { icon: 'notifications', label: 'Notifications', hasArrow: true },
    { icon: 'shield-checkmark', label: 'Privacy', hasArrow: true },
    { icon: 'help-circle', label: 'Help & Support', hasArrow: true },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-6 shadow-sm border border-gray-100">
          <View className="items-center">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl font-bold text-white">PG</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">Paul Greetham</Text>
            <Text className="text-gray-600 mt-1">Football Enthusiast</Text>
            <Text className="text-gray-500 text-sm mt-2">Member since 2024</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">Your Activity</Text>
          <View className="flex-row justify-around">
            {userStats.map((stat, index) => (
              <View key={index} className="items-center">
                <Text className="text-2xl font-bold text-blue-600">{stat.value}</Text>
                <Text className="text-xs text-gray-600 mt-1 text-center">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Profile Options */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center justify-between p-4 ${
                index !== profileOptions.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons name={option.icon as any} size={20} color="#6B7280" />
                <Text className="text-gray-900 ml-3 font-medium">{option.label}</Text>
              </View>
              {option.hasArrow && (
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Edit Profile Button */}
        <View className="mx-4 mt-6">
          <TouchableOpacity className="bg-blue-600 rounded-lg py-3 items-center">
            <Text className="text-white font-semibold text-base">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Footer spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
} 