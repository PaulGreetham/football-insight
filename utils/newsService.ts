import Constants from 'expo-constants';
import { NewsResponse, NewsArticle } from '../types/news';

const BASE_URL = 'https://gnews.io/api/v4';

// Keywords that indicate non-soccer sports content (to be filtered out)
const NON_SOCCER_SPORTS_BLACKLIST = [
  // American Football - most specific terms only
  'NFL',
  'college football',
  'NFL draft',
  'quarterback',
  'touchdown',
  'Super Bowl',
  'American Football',
  'fantasy football',
  'end zone',
  'field goal',
  'rushing yards',
  'passing yards',
  
  // Hockey/NHL - specific terms only
  'NHL',
  'hockey',
  'ice hockey',
  'Stanley Cup',
  'puck',
  
  // Basketball - specific terms only
  'NBA',
  'basketball',
  'WNBA',
  'slam dunk',
  'three-pointer',
  
  // Rugby - specific terms
  'rugby',
  'Rugby Union',
  'Rugby League',
  'scrum',
  
  // Tennis - specific terms
  'tennis',
  'Wimbledon',
  'ATP',
  'WTA',
  'Grand Slam tennis',
  
  // Swimming - specific terms
  'swimming',
  'freestyle',
  'backstroke',
  'breaststroke',
  'butterfly stroke',
  
  // UFC/MMA - specific terms
  'UFC',
  'MMA',
  'Mixed Martial Arts',
  'Ultimate Fighting Championship',
  'octagon',
  
  // Other major sports - specific terms only
  'baseball',
  'MLB',
  'World Series',
  'home run',
  'cricket',
  'wicket',
  'bowling average',
  'golf',
  'PGA Tour',
  'boxing',
  'Formula 1',
  'F1 racing',
  'NASCAR',
  'volleyball',
  'track and field',
  'marathon',
  'cycling',
  'Tour de France',
  'Winter Olympics',
  'figure skating'
];

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
   * Filter out non-soccer sports content to keep only soccer/football
   */
  private static filterOutNonSoccerSports(articles: NewsArticle[]): NewsArticle[] {
    const filtered = articles.filter(article => {
      const text = (article.title + ' ' + article.description).toLowerCase();
      
      // Check if any non-soccer sports keywords are present
      const hasNonSoccerSportsContent = NON_SOCCER_SPORTS_BLACKLIST.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
      
      if (hasNonSoccerSportsContent) {
        console.log('🚫 Filtered out non-soccer sports article:', article.title);
        return false;
      }
      
      return true;
    });
    
    console.log(`🔍 Filtered out ${articles.length - filtered.length} non-soccer sports articles`);
    console.log(`✅ Keeping ${filtered.length} soccer/football articles`);
    
    return filtered;
  }

  /**
   * Fetch football transfer news specifically
   */
  static async getFootballTransferNews(limit: number = 100): Promise<NewsArticle[]> {
    try {
      this.logApiKeyStatus();
      
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found. Please check your environment variables.');
        return [];
      }

      // Simplified transfer-focused search (under 200 chars)
      const transferTerms = 'football transfer OR soccer transfer OR "transfer window"';

      const url = `${BASE_URL}/search?q=${encodeURIComponent(transferTerms)}&lang=en&max=${limit}&apikey=${this.API_KEY}`;
      
      console.log('⚽ Fetching football transfer news worldwide...');
      console.log('📍 URL (without API key):', url.replace(/apikey=[^&]*/, 'apikey=***'));
      console.log('🔄 Transfer-focused search terms:', transferTerms);
      console.log('📏 Query length:', transferTerms.length, 'characters');
      console.log('🌍 Parameters: lang=en, max=' + limit);
      
      const response = await fetch(url);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response statusText:', response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: NewsResponse = await response.json();
      console.log('✅ Fetched raw transfer articles:', data.articles.length);
      console.log('📊 Total transfer articles available worldwide:', data.totalArticles);
      
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
      
      console.log('🎯 After transfer keyword filter:', transferArticles.length, 'articles');
      
      // Filter out non-soccer sports content
      const soccerOnlyArticles = this.filterOutNonSoccerSports(transferArticles);
      
      console.log('🏆 Final transfer articles after all filters:', soccerOnlyArticles.length);
      
      return soccerOnlyArticles;
    } catch (error) {
      console.error('❌ Error fetching football transfer news:', error);
      return [];
    }
  }

  /**
   * Fetch general football news worldwide
   */
  static async getGlobalFootballNews(limit: number = 100): Promise<NewsArticle[]> {
    try {
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found for global football news.');
        return [];
      }

      // Simple football search terms
      const footballTerms = 'football OR soccer OR "Premier League" OR "Champions League"';

      const url = `${BASE_URL}/search?q=${encodeURIComponent(footballTerms)}&lang=en&max=${limit}&apikey=${this.API_KEY}`;
      
      console.log('🌍 Fetching global football news...');
      console.log('📍 URL (without API key):', url.replace(/apikey=[^&]*/, 'apikey=***'));
      console.log('📏 Query length:', footballTerms.length, 'characters');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Global football API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: NewsResponse = await response.json();
      console.log('✅ Fetched raw global football articles:', data.articles.length);
      console.log('📊 Total global football articles available:', data.totalArticles);
      
      // Filter out non-soccer sports content
      const soccerOnlyArticles = this.filterOutNonSoccerSports(data.articles);
      
      console.log('🏆 Final global articles after filtering:', soccerOnlyArticles.length);
      
      return soccerOnlyArticles;
    } catch (error) {
      console.error('❌ Error fetching global football news:', error);
      return [];
    }
  }

  /**
   * Fetch football headlines from sports category
   */
  static async getFootballHeadlines(limit: number = 100): Promise<NewsArticle[]> {
    try {
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found for football headlines.');
        return [];
      }

      const url = `${BASE_URL}/top-headlines?category=sports&lang=en&max=${limit}&apikey=${this.API_KEY}`;
      
      console.log('🏆 Fetching sports headlines worldwide...');
      console.log('📍 URL (without API key):', url.replace(/apikey=[^&]*/, 'apikey=***'));
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Headlines API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: NewsResponse = await response.json();
      console.log('✅ Fetched raw sports headlines:', data.articles.length);
      
      // Filter to football/soccer only
      const footballHeadlines = data.articles.filter(article => {
        const text = (article.title + ' ' + article.description).toLowerCase();
        return text.includes('football') || text.includes('soccer') || 
               text.includes('premier league') || text.includes('champions league') ||
               text.includes('fifa') || text.includes('uefa') || text.includes('la liga') ||
               text.includes('serie a') || text.includes('bundesliga') || text.includes('ligue 1');
      });
      
      console.log('⚽ After football keyword filter:', footballHeadlines.length, 'headlines');
      
      // Filter out non-soccer sports content
      const soccerOnlyHeadlines = this.filterOutNonSoccerSports(footballHeadlines);
      
      console.log('🏆 Final headlines after all filters:', soccerOnlyHeadlines.length);
      
      return soccerOnlyHeadlines;
    } catch (error) {
      console.error('❌ Error fetching football headlines:', error);
      return [];
    }
  }

  /**
   * Fetch maximum worldwide football content
   */
  static async getMaximumFootballContent(): Promise<NewsArticle[]> {
    try {
      console.log('🚀 Starting maximum worldwide football content fetch...');
      
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found for maximum content.');
        return [];
      }

      // Fetch from multiple sources in parallel for maximum content
      console.log('📡 Making parallel API requests...');
      const [transferNews, globalNews, headlines] = await Promise.all([
        this.getFootballTransferNews(100), // Maximum transfer-specific news
        this.getGlobalFootballNews(100),   // Maximum general football news  
        this.getFootballHeadlines(100)     // Maximum top sports headlines (filtered to football)
      ]);

      console.log('📊 Maximum Content Results Summary:');
      console.log('  - Transfer news articles:', transferNews.length);
      console.log('  - Global football articles:', globalNews.length);
      console.log('  - Football headlines:', headlines.length);

      // Combine all sources
      const combined = [...transferNews, ...globalNews, ...headlines];
      console.log('  - Combined before dedup:', combined.length);
      
      // Remove duplicates by URL
      const unique = combined.filter((article, index, arr) => 
        arr.findIndex(a => a.url === article.url) === index
      );

      console.log('  - After deduplication:', unique.length);

      // Sort by publication date (newest first)
      const sorted = unique
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      console.log('🎉 FINAL RESULT: Returning', sorted.length, 'unique football articles worldwide');
      
      // Log first 10 articles for debugging
      sorted.slice(0, 10).forEach((article, index) => {
        const isTransfer = article.title.toLowerCase().includes('transfer') || 
                          article.title.toLowerCase().includes('signing') ||
                          article.title.toLowerCase().includes('deal');
        console.log(`⚽ ${index + 1}. ${article.title} (${article.source.name}) ${isTransfer ? '🔄' : '📰'}`);
      });
      
      if (sorted.length < 50) {
        console.warn('⚠️ WARNING: Only got', sorted.length, 'articles. This seems low. Check API limits or filtering.');
      }
      
      return sorted;
    } catch (error) {
      console.error('❌ Error fetching maximum football content:', error);
      return [];
    }
  }

  /**
   * Fetch comprehensive football transfer content (confirmed + rumors)
   */
  static async getMixedFootballContent(limit: number = 15): Promise<NewsArticle[]> {
    try {
      console.log('🔄 Starting maximum worldwide football content fetch...');
      
      if (!this.API_KEY) {
        console.error('❌ GNews API key not found for football content.');
        return [];
      }

      // Use the maximum content method and limit results
      const allFootballContent = await this.getMaximumFootballContent();
      
      // Limit to requested number but ensure we get the most recent
      const limitedContent = allFootballContent.slice(0, Math.max(limit, 50)); // Minimum 50 articles for good variety
      
      console.log('📊 Content Results Summary:');
      console.log('  - Total football articles available:', allFootballContent.length);
      console.log('  - Returning:', limitedContent.length, 'articles');

      // Log article titles for debugging
      limitedContent.slice(0, 5).forEach((article, index) => {
        const isTransfer = article.title.toLowerCase().includes('transfer') || 
                          article.title.toLowerCase().includes('signing') ||
                          article.title.toLowerCase().includes('deal');
        console.log(`⚽ ${index + 1}. ${article.title} (${article.source.name}) ${isTransfer ? '🔄' : '📰'}`);
      });
      
      return limitedContent;
    } catch (error) {
      console.error('❌ Error fetching football content:', error);
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