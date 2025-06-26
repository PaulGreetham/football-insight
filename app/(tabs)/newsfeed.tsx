import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NewsService } from '../../utils/newsService';
import { NewsArticle } from '../../types/news';

export default function NewsfeedScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usingExamples, setUsingExamples] = useState(false);

  const fetchNews = async () => {
    try {
      setError(null);
      const newsData = await NewsService.getMixedFootballContent(75);
      setArticles(newsData);
      
      // Check if we're using example articles by looking at the source
      const hasExampleSources = newsData.some(article => 
        article.source.name === 'Football Central' || 
        article.source.name === 'Football Transfer News' ||
        article.url.includes('example.com')
      );
      setUsingExamples(hasExampleSources);
      
      console.log('📱 Loaded', newsData.length, 'football articles in newsfeed', hasExampleSources ? '(using examples)' : '(live data)');
    } catch (err) {
      setError('Failed to load football news. Please try again.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('🔄 User initiated refresh - fetching fresh worldwide content...');
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
      <SafeAreaView className="flex-1 bg-blue-900" edges={['top']}>
        <StatusBar style="light" />
        {/* Enhanced Loading Header */}
        <View className="bg-blue-900 px-6 py-6">
          <View className="flex-row items-center justify-center">
            <Text className="text-3xl font-black text-white ml-3 tracking-tight">
              FOOTBALL INSIGHT
            </Text>
          </View>
          <View className="flex-row items-center justify-center mt-2">
            <Ionicons name="globe-outline" size={16} color="#93C5FD" />
            <Text className="text-blue-200 text-sm font-semibold ml-2 tracking-wide">
              WORLDWIDE COVERAGE
            </Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text className="mt-4 text-gray-600 font-medium">Loading worldwide football news...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-blue-900" edges={['top']}>
        <StatusBar style="light" />
        {/* Enhanced Error Header */}
        <View className="bg-blue-900 px-6 py-6">
          <View className="flex-row items-center justify-center">
            <Text className="text-3xl font-black text-white ml-3 tracking-tight">
              FOOTBALL INSIGHT
            </Text>
          </View>
          <View className="flex-row items-center justify-center mt-2">
            <Ionicons name="globe-outline" size={16} color="#93C5FD" />
            <Text className="text-blue-200 text-sm font-semibold ml-2 tracking-wide">
              WORLDWIDE COVERAGE
            </Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center px-4 bg-gray-50">
          <Text className="text-red-600 text-center mb-4 font-medium">{error}</Text>
          <TouchableOpacity 
            onPress={fetchNews}
            className="bg-blue-900 px-8 py-4 rounded-lg shadow-lg"
          >
            <Text className="text-white font-bold text-lg">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-900" edges={['top']}>
      <StatusBar style="light" />
      
      {/* Enhanced Dynamic Header */}
      <View className="bg-blue-900">
        <View className="px-6 py-6">
          <View className="flex-row items-center justify-center">
            <Text className="text-3xl font-black text-white ml-3 tracking-tight">
              FOOTBALL INSIGHT
            </Text>
          </View>
          <View className="flex-row items-center justify-center mt-2">
            <Ionicons name="globe-outline" size={16} color="#93C5FD" />
            <Text className="text-blue-200 text-sm font-semibold ml-2 tracking-wide">
              {usingExamples ? 'DEMO MODE • API LIMIT REACHED' : 'LIVE WORLDWIDE COVERAGE'}
            </Text>
          </View>
        </View>
        
        {/* Stats Bar */}
        <View className="bg-blue-800 px-6 py-3">
          <View className="flex-row justify-center items-center space-x-8">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#93C5FD" />
              <Text className="text-blue-200 text-sm font-bold ml-2">
                LIVE UPDATES
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="flash-outline" size={16} color="#93C5FD" />
              <Text className="text-blue-200 text-sm font-bold ml-2">
                BREAKING NEWS
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* News Feed - Remove all horizontal padding/margins */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Remove the outer container padding */}
        <View>
          {articles.map((article, index) => (
            <TouchableOpacity 
              key={`${article.url}-${index}`}
              onPress={() => openArticle(article.url)}
              className="bg-white mb-1 shadow-sm border-b border-gray-100"
              activeOpacity={0.7}
            >
              {/* Article Image - Full width, no padding */}
              {article.image && (
                <Image
                  source={{ uri: article.image }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              )}
              
              {/* Content with padding only on sides */}
              <View className="px-4 py-4">
                <View className="flex-row justify-between items-start mb-3">
                  <Text className="text-sm font-bold text-blue-900 uppercase tracking-wide flex-1">
                    {article.source.name}
                  </Text>
                  <Text className="text-sm text-gray-600 ml-2 font-semibold">
                    {NewsService.formatPublishedDate(article.publishedAt)}
                  </Text>
                </View>
                
                <Text className="text-xl font-black text-gray-900 mb-3 leading-6">
                  {article.title}
                </Text>
                
                {article.description && (
                  <Text className="text-gray-700 text-base leading-6 mb-4 font-normal">
                    {article.description}
                  </Text>
                )}
                
                <View className="flex-row justify-end items-center">
                  <View className="flex-row items-center">
                    <Text className="text-blue-900 text-base font-bold mr-2">
                      READ MORE
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#1E3A8A" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {articles.length === 0 && !loading && (
            <View className="bg-white p-8 items-center">
              <Text className="text-gray-500 text-center mb-2">
                No football news available at the moment.
              </Text>
              <Text className="text-gray-400 text-xs text-center mb-4">
                Pull down to refresh and load fresh worldwide content
              </Text>
              <TouchableOpacity 
                onPress={fetchNews}
                className="bg-blue-600 px-4 py-2 rounded-lg mt-2"
              >
                <Text className="text-white font-medium">Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 