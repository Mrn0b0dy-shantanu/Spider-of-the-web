
export interface NewsItem {
  _id: string;
  title: string;
  title_en: string;
  claim_text: string;
  verdict_type: 'false' | 'misleading' | 'unverified';
  verdict: string;
  summary_ai: string;
  summary_ai_en: string;
  published_at: string;
  image_url: string;
  source_url: string;
  analysis: {
    summary_bn: string;
    summary_en: string;
    impact_level: 'low' | 'medium' | 'high';
    key_figures: string[];
    category_tags: string[];
    spread_analysis: string;
  };
}

export interface NewsResponse {
  results: NewsItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

const API_KEY = "init6-drishtikon-2026";
const BASE_URL = "https://drishtikon.life/server/api/hackathon";

/**
 * Default fetch function used for initial load and verdict filtering.
 * Per user requirement, this ALWAYS defaults to 'q=earthquake' on the search endpoint.
 */
export async function fetchNews(page = 1, pageSize = 20, verdictType?: string): Promise<NewsResponse> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    q: "earthquake",
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (verdictType && verdictType !== "all") {
    params.append("verdict_type", verdictType);
  }

  const url = `${BASE_URL}/rumors/search?${params.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 600 }
  });

  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.results ? data : data.data;
}

/**
 * Search function used for manual user queries.
 */
export async function searchNews(query: string, page = 1, pageSize = 20): Promise<NewsResponse> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    q: query || "earthquake",
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  const url = `${BASE_URL}/rumors/search?${params.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 600 }
  });

  if (!res.ok) throw new Error("Failed to search news");
  const data = await res.json();
  return data.results ? data : data.data;
}
