import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function NewsfeedScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Mock article data
  const articles = [
    {
      id: 1,
      title: "Transfer News: Premier League Giants Eye Star Striker",
      summary: "Multiple clubs reportedly interested in securing the services of the prolific goalscorer...",
      time: "2 hours ago",
      source: "Sky Sports"
    },
    {
      id: 2,
      title: "Champions League Preview: Key Matches This Week",
      summary: "European football returns with some blockbuster fixtures across the continent...",
      time: "4 hours ago",
      source: "ESPN"
    },
    {
      id: 3,
      title: "Injury Update: Star Player Expected to Return Soon",
      summary: "Medical team optimistic about recovery timeline for the international forward...",
      time: "6 hours ago",
      source: "BBC Sport"
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Football Insight</Text>
        <Text className="text-sm text-gray-600 mt-1">Stay updated with the latest football news</Text>
      </View>

      {/* News Feed */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-2">
          {articles.map((article) => (
            <View key={article.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {article.source}
                </Text>
                <Text className="text-xs text-gray-500">{article.time}</Text>
              </View>
              
              <Text className="text-lg font-bold text-gray-900 mb-2 leading-6">
                {article.title}
              </Text>
              
              <Text className="text-gray-600 text-sm leading-5 mb-3">
                {article.summary}
              </Text>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row space-x-4">
                  <Text className="text-xs text-gray-500">👍 24</Text>
                  <Text className="text-xs text-gray-500">💬 8</Text>
                  <Text className="text-xs text-gray-500">📤 Share</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        {/* Footer spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
} 