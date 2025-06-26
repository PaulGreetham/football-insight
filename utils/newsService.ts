import Constants from 'expo-constants';
import { NewsResponse, NewsArticle } from '../types/news';

const BASE_URL = 'https://gnews.io/api/v4';

export class NewsService {
  private static readonly API_KEY = Constants.expoConfig?.extra?.EXPO_GNEWS_API_KEY || 
                                   Constants.manifest?.extra?.EXPO_GNEWS_API_KEY;

  /**
   * Debug function to log API key status
   */
  private static logApiKeyStatus() {
    console.log('=== API KEY DEBUG ===');
    console.log('Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
    console.log('Constants.manifest?.extra:', Constants.manifest?.extra);
    console.log('API_KEY exists:', !!this.API_KEY);
    console.log('API_KEY length:', this.API_KEY?.length || 0);
    console.log('API_KEY first 4 chars:', this.API_KEY?.substring(0, 4) || 'NONE');
    console.log('API_KEY last 4 chars:', this.API_KEY?.substring(this.API_KEY.length - 4) || 'NONE');
    console.log('====================');
  }

  /**
   * Fetch football transfer news specifically
   */
  static async getFootballTransferNews(limit: number = 15): Promise<NewsArticle[]> {
    try {
      this.logApiKeyStatus();
      
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found. Please check your environment variables.');
        return [];
      }

      // Simplified transfer-focused search (under 200 chars)
      const transferTerms = 'football transfer OR soccer transfer OR "transfer window" OR "transfer news"';

      const url = `${BASE_URL}/search?q=${encodeURIComponent(transferTerms)}&lang=en&country=gb&max=${limit}&apikey=${this.API_KEY}`;
      
      console.log('⚽ Fetching football transfer news...');
      console.log('📍 URL (without API key):', url.replace(/apikey=[^&]*/, 'apikey=***'));
      console.log('🔄 Transfer-focused search terms:', transferTerms);
      console.log('📏 Query length:', transferTerms.length, 'characters');
      console.log('🌍 Parameters: lang=en, country=gb, max=' + limit);
      
      const response = await fetch(url);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response statusText:', response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: NewsResponse = await response.json();
      console.log('✅ Fetched transfer articles:', data.articles.length);
      console.log('📊 Total transfer articles available:', data.totalArticles);
      
      // Filter articles to ensure they're actually about transfers
      const transferArticles = data.articles.filter(article => {
        const text = (article.title + ' ' + article.description).toLowerCase();
        const transferKeywords = [
          'transfer', 'transfers', 'signing', 'signed', 'sign', 'deal', 'deals',
          'move', 'moves', 'bid', 'bids', 'target', 'targets', 'contract',
          'rumour', 'rumor', 'linked', 'interest', 'swap', 'loan', 'agreement',
          'negotiate', 'offer', 'fee', 'price', 'valuation'
        ];
        
        return transferKeywords.some(keyword => text.includes(keyword));
      });
      
      console.log('🎯 Filtered to transfer-only articles:', transferArticles.length);
      
      // Log first few articles for debugging
      transferArticles.slice(0, 3).forEach((article, index) => {
        console.log(`📰 Transfer ${index + 1}:`, {
          title: article.title,
          source: article.source.name,
          publishedAt: article.publishedAt
        });
      });
      
      return transferArticles;
    } catch (error) {
      console.error('❌ Error fetching football transfer news:', error);
      return [];
    }
  }

  /**
   * Fetch additional transfer rumors and speculation
   */
  static async getTransferRumors(limit: number = 10): Promise<NewsArticle[]> {
    try {
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found for transfer rumors.');
        return [];
      }

      // Simplified rumors search (under 200 chars)
      const rumorTerms = 'football rumor OR soccer rumour OR "transfer speculation" OR "linked with"';

      const url = `${BASE_URL}/search?q=${encodeURIComponent(rumorTerms)}&lang=en&country=gb&max=${limit}&apikey=${this.API_KEY}`;
      
      console.log('📰 Fetching transfer rumors...');
      console.log('📍 Rumors URL (without API key):', url.replace(/apikey=[^&]*/, 'apikey=***'));
      console.log('📏 Rumors query length:', rumorTerms.length, 'characters');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Rumors API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: NewsResponse = await response.json();
      console.log('✅ Fetched transfer rumors:', data.articles.length);
      
      return data.articles;
    } catch (error) {
      console.error('❌ Error fetching transfer rumors:', error);
      return [];
    }
  }

  /**
   * Fetch comprehensive football transfer content (confirmed + rumors)
   */
  static async getMixedFootballContent(limit: number = 15): Promise<NewsArticle[]> {
    try {
      console.log('🔄 Starting transfer-focused content fetch...');
      
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found for transfer content.');
        return [];
      }

      const [transferNews, transferRumors] = await Promise.all([
        this.getFootballTransferNews(Math.ceil(limit * 0.8)), // 80% confirmed transfers
        this.getTransferRumors(Math.ceil(limit * 0.2)) // 20% rumors/speculation
      ]);

      console.log('📊 Transfer Results Summary:');
      console.log('  - Confirmed transfers:', transferNews.length);
      console.log('  - Transfer rumors:', transferRumors.length);

      // Combine and remove duplicates by URL
      const combined = [...transferNews, ...transferRumors];
      const unique = combined.filter((article, index, arr) => 
        arr.findIndex(a => a.url === article.url) === index
      );

      console.log('  - Combined total:', combined.length);
      console.log('  - After deduplication:', unique.length);

      // Sort by publication date (newest first)
      const sorted = unique
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, limit);

      console.log('✅ Returning', sorted.length, 'transfer articles');
      
      // Log article titles for debugging
      sorted.forEach((article, index) => {
        const isTransfer = article.title.toLowerCase().includes('transfer') || 
                          article.title.toLowerCase().includes('signing') ||
                          article.title.toLowerCase().includes('deal');
        console.log(`⚽ ${index + 1}. ${article.title} (${article.source.name}) ${isTransfer ? '🔄' : '📰'}`);
      });
      
      return sorted;
    } catch (error) {
      console.error('❌ Error fetching transfer content:', error);
      return [];
    }
  }

  /**
   * Format the published date for display
   */
  static formatPublishedDate(publishedAt: string): string {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
      return published.toLocaleDateString();
    }
  }
} 