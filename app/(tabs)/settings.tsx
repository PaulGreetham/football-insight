import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications',
          label: 'Push Notifications',
          type: 'switch',
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          icon: 'mail',
          label: 'Email Notifications',
          type: 'switch',
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          type: 'switch',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: 'color-palette',
          label: 'Theme',
          type: 'navigate',
          hasArrow: true,
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          icon: 'football',
          label: 'Favorite Leagues',
          type: 'navigate',
          hasArrow: true,
        },
        {
          icon: 'language',
          label: 'Language',
          type: 'navigate',
          hasArrow: true,
          value: 'English',
        },
        {
          icon: 'location',
          label: 'Region',
          type: 'navigate',
          hasArrow: true,
          value: 'United Kingdom',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          label: 'Help Center',
          type: 'navigate',
          hasArrow: true,
        },
        {
          icon: 'chatbubble',
          label: 'Contact Us',
          type: 'navigate',
          hasArrow: true,
        },
        {
          icon: 'star',
          label: 'Rate App',
          type: 'navigate',
          hasArrow: true,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle',
          label: 'About Football Insight',
          type: 'navigate',
          hasArrow: true,
        },
        {
          icon: 'document-text',
          label: 'Terms of Service',
          type: 'navigate',
          hasArrow: true,
        },
        {
          icon: 'shield-checkmark',
          label: 'Privacy Policy',
          type: 'navigate',
          hasArrow: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mt-6">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
              {section.title}
            </Text>
            
            <View className="bg-white mx-4 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  className={`flex-row items-center justify-between p-4 ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  disabled={item.type === 'switch'}
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                    <View className="ml-3 flex-1">
                      <Text className="text-gray-900 font-medium">{item.label}</Text>
                      {item.value && item.type === 'navigate' && (
                        <Text className="text-gray-500 text-sm mt-1">{item.value}</Text>
                      )}
                    </View>
                  </View>
                  
                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value as boolean}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                      thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                    />
                  ) : item.hasArrow ? (
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View className="mx-4 mt-8 mb-6">
          <TouchableOpacity className="bg-red-600 rounded-lg py-3 items-center">
            <Text className="text-white font-semibold text-base">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center mb-8">
          <Text className="text-gray-500 text-sm">Football Insight v1.0.0</Text>
        </View>

        {/* Footer spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
} 