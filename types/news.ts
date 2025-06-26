export interface NewsSource {
  name: string;
  url: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: NewsSource;
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export interface NewsApiError {
  error: string;
} 