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

// Example football articles for when API is exhausted or fails
const EXAMPLE_FOOTBALL_ARTICLES: NewsArticle[] = [
  {
    title: "Manchester United Complete Signing of Promising Young Midfielder",
    description: "The Red Devils have secured the services of a highly-rated 22-year-old midfielder from Serie A in a deal worth €45 million. The player is expected to bring creativity and energy to United's midfield.",
    content: "Manchester United have completed the signing of a promising young midfielder...",
    url: "https://example.com/man-united-signing",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    publishedAt: new Date().toISOString(),
    source: {
      name: "Football Central",
      url: "https://example.com"
    }
  },
  {
    title: "Liverpool Eye Summer Move for Champions League Winner",
    description: "Jurgen Klopp's side are reportedly monitoring a 25-year-old striker who scored 18 goals in the Champions League last season. The player's current club values him at €80 million.",
    content: "Liverpool are planning a major summer overhaul...",
    url: "https://example.com/liverpool-target",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    source: {
      name: "Football Transfer News",
      url: "https://example.com"
    }
  },
  {
    title: "Real Madrid Prepare Record Bid for Premier League Star",
    description: "Los Blancos are ready to break their transfer record to secure the signature of England international who has been in outstanding form this season with 24 goals and 12 assists.",
    content: "Real Madrid are preparing a world-record bid...",
    url: "https://example.com/real-madrid-bid",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    source: {
      name: "Madrid Sports Daily",
      url: "https://example.com"
    }
  },
  {
    title: "Barcelona Agree Deal for Brazilian Wonderkid",
    description: "The Catalan giants have reached an agreement with Santos for their 18-year-old attacking midfielder, who has been compared to Ronaldinho. The deal includes a €100m release clause.",
    content: "Barcelona have agreed terms with Santos...",
    url: "https://example.com/barcelona-wonderkid",
    image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    source: {
      name: "Barca News",
      url: "https://example.com"
    }
  },
  {
    title: "Chelsea Close to Finalizing Double Swoop",
    description: "The Blues are in advanced negotiations for two high-profile signings: a German defender and an Argentine attacking midfielder. Combined fee expected to exceed €120 million.",
    content: "Chelsea are working on two major signings...",
    url: "https://example.com/chelsea-double-deal",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    source: {
      name: "London Football",
      url: "https://example.com"
    }
  },
  {
    title: "PSG Set to Lose Star Player to Serie A Giants",
    description: "Paris Saint-Germain's French international midfielder is reportedly close to joining Juventus on a free transfer when his contract expires this summer.",
    content: "PSG face losing one of their key players...",
    url: "https://example.com/psg-departure",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    source: {
      name: "Paris Football",
      url: "https://example.com"
    }
  },
  {
    title: "Arsenal Target World Cup Hero in January Window",
    description: "The Gunners are planning a January move for the Morocco international who starred at the World Cup. His current club is demanding €60 million for the versatile defender.",
    content: "Arsenal are targeting a January reinforcement...",
    url: "https://example.com/arsenal-january-target",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    source: {
      name: "Gunners Report",
      url: "https://example.com"
    }
  },
  {
    title: "Bayern Munich Eye Premier League Goalkeeper",
    description: "The German champions are monitoring the situation of England's number one goalkeeper whose contract talks with his current club have stalled. Bayern see him as a long-term replacement.",
    content: "Bayern Munich are exploring goalkeeper options...",
    url: "https://example.com/bayern-goalkeeper",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&h=400&fit=crop",
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    source: {
      name: "Bundesliga Today",
      url: "https://example.com"
    }
  }
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
   * Check if API error indicates exhausted quota or rate limit
   */
  private static isApiQuotaExhausted(errorMessage: string): boolean {
    const quotaMessages = [
      'rate limit',
      'quota exceeded',
      'too many requests',
      'api limit',
      'daily limit',
      'monthly limit',
      'requests per',
      'usage limit'
    ];
    
    return quotaMessages.some(msg => errorMessage.toLowerCase().includes(msg));
  }

  /**
   * Get example articles when API is unavailable
   */
  private static getExampleArticles(limit: number = 15): NewsArticle[] {
    console.log('📰 Using example articles (API unavailable)');
    return EXAMPLE_FOOTBALL_ARTICLES.slice(0, limit);
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
        
        // Check if it's a quota error and return examples
        if (this.isApiQuotaExhausted(errorText)) {
          console.warn('🚫 Transfer API quota exhausted. Using example articles.');
          return this.getExampleArticles(Math.min(limit, 8)).filter(article => 
            article.title.toLowerCase().includes('transfer') || 
            article.title.toLowerCase().includes('signing') ||
            article.title.toLowerCase().includes('deal')
          );
        }
        
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
      
      // Check if it's a quota/rate limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (this.isApiQuotaExhausted(errorMessage)) {
        console.warn('🚫 Transfer API quota exhausted. Using example articles.');
        return this.getExampleArticles(Math.min(limit, 8)).filter(article => 
          article.title.toLowerCase().includes('transfer') || 
          article.title.toLowerCase().includes('signing') ||
          article.title.toLowerCase().includes('deal')
        );
      }
      
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

      // General football search terms
      const footballTerms = 'football OR soccer OR "Premier League" OR "Champions League"';

      const url = `${BASE_URL}/search?q=${encodeURIComponent(footballTerms)}&lang=en&max=${limit}&apikey=${this.API_KEY}`;
      
      console.log('🌍 Fetching global football news...');
      console.log('📍 URL (without API key):', url.replace(/apikey=[^&]*/, 'apikey=***'));
      console.log('📏 Query length:', footballTerms.length, 'characters');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Global football API Error Response:', errorText);
        
        // Check if it's a quota error
        if (this.isApiQuotaExhausted(errorText)) {
          console.warn('🚫 Global football API quota exhausted. Using example articles.');
          return this.getExampleArticles(Math.min(limit, 8));
        }
        
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
      
      // Check if it's a quota/rate limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (this.isApiQuotaExhausted(errorMessage)) {
        console.warn('🚫 Global football API quota exhausted. Using example articles.');
        return this.getExampleArticles(Math.min(limit, 8));
      }
      
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
        
        // Check if it's a quota error
        if (this.isApiQuotaExhausted(errorText)) {
          console.warn('🚫 Headlines API quota exhausted. Using example articles.');
          return this.getExampleArticles(Math.min(limit, 8));
        }
        
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
      
      // Check if it's a quota/rate limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (this.isApiQuotaExhausted(errorMessage)) {
        console.warn('🚫 Headlines API quota exhausted. Using example articles.');
        return this.getExampleArticles(Math.min(limit, 8));
      }
      
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
        console.warn('❌ GNews API key not found for maximum content. Using example articles.');
        return this.getExampleArticles(50);
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
      
      // If no articles from any source, use examples
      if (combined.length === 0) {
        console.warn('📰 No articles from any API source. Using example articles.');
        return this.getExampleArticles(50);
      }
      
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
      
      // Check if it's a quota/rate limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (this.isApiQuotaExhausted(errorMessage)) {
        console.warn('🚫 API quota exhausted. Using example articles.');
        return this.getExampleArticles(50);
      }
      
      // For other errors, also fall back to examples
      console.warn('📰 API error occurred. Using example articles.');
      return this.getExampleArticles(50);
    }
  }

  /**
   * Fetch comprehensive football transfer content (confirmed + rumors)
   */
  static async getMixedFootballContent(limit: number = 15): Promise<NewsArticle[]> {
    try {
      console.log('🔄 Starting maximum worldwide football content fetch...');
      
      if (!this.API_KEY) {
        console.warn('❌ GNews API key not found for football content. Using example articles.');
        return this.getExampleArticles(limit);
      }

      // Use the maximum content method and limit results
      const allFootballContent = await this.getMaximumFootballContent();
      
      // If we got no articles from API, use examples
      if (allFootballContent.length === 0) {
        console.warn('📰 No articles from API. Using example articles.');
        return this.getExampleArticles(limit);
      }
      
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
      
      // Check if it's a quota/rate limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (this.isApiQuotaExhausted(errorMessage)) {
        console.warn('🚫 API quota exhausted. Using example articles.');
        return this.getExampleArticles(limit);
      }
      
      // For other errors, also fall back to examples
      console.warn('📰 API error occurred. Using example articles.');
      return this.getExampleArticles(limit);
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