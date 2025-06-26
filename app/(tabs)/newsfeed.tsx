import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { NewsService } from '../../utils/newsService';
import { NewsArticle } from '../../types/news';

export default function NewsfeedScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setError(null);
      const newsData = await NewsService.getMixedFootballContent(15);
      setArticles(newsData);
    } catch (err) {
      setError('Failed to load transfer news. Please try again.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  const openArticle = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('Failed to open article:', err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Transfer Central ⚽</Text>
          <Text className="text-sm text-gray-600 mt-1">Latest football transfer news & rumors</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text className="mt-4 text-gray-600">Loading latest transfer news...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Transfer Central ⚽</Text>
          <Text className="text-sm text-gray-600 mt-1">Latest football transfer news & rumors</Text>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-600 text-center mb-4">{error}</Text>
          <TouchableOpacity 
            onPress={fetchNews}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Transfer Central ⚽</Text>
        <Text className="text-sm text-gray-600 mt-1">Latest football transfer news & rumors</Text>
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
          {articles.map((article, index) => (
            <TouchableOpacity 
              key={`${article.url}-${index}`}
              onPress={() => openArticle(article.url)}
              className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100"
              activeOpacity={0.7}
            >
              {/* Article Image */}
              {article.image && (
                <Image
                  source={{ uri: article.image }}
                  className="w-full h-48 rounded-lg mb-3"
                  resizeMode="cover"
                />
              )}
              
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-xs font-medium text-blue-600 uppercase tracking-wide flex-1">
                  {article.source.name}
                </Text>
                <Text className="text-xs text-gray-500 ml-2">
                  {NewsService.formatPublishedDate(article.publishedAt)}
                </Text>
              </View>
              
              <Text className="text-lg font-bold text-gray-900 mb-2 leading-6">
                {article.title}
              </Text>
              
              {article.description && (
                <Text className="text-gray-600 text-sm leading-5 mb-3">
                  {article.description}
                </Text>
              )}
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row space-x-4">
                  <Text className="text-xs text-gray-500">🔄 Transfer News</Text>
                </View>
                <Text className="text-xs text-blue-600 font-medium">
                  Tap to read →
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {articles.length === 0 && !loading && (
            <View className="bg-white rounded-lg p-8 items-center">
              <Text className="text-gray-500 text-center">
                No transfer news available at the moment.
              </Text>
              <TouchableOpacity 
                onPress={fetchNews}
                className="bg-blue-600 px-4 py-2 rounded-lg mt-4"
              >
                <Text className="text-white font-medium">Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Footer spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
} 