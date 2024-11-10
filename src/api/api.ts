import axios from 'axios';

const API_URL = 'https://fh-2024.fly.dev/';

// Define the structure of a search result
export interface SearchResult {
  id: number;
  name: string;
  category: string;
  // Add other fields based on your data structure
}

// Define Filters type as needed for your app
export interface Filters {
  categories?: string[];
  // Define other filters (e.g., price range, date range, etc.)
}

// Function to fetch results from Elasticsearch API
// export const fetchResults = async (debouncedQuery: string, filters: Filters): Promise<SearchResult[]> => {
//   const response = await axios.post(API_URL, { debouncedQuery, filters });
//   return response.data;
// };

export const fetchResults = async (): Promise<any[]> => {
  const response = await axios.get(API_URL + 'all');
  return response.data;
};

export const fetchResultsQuery = async (query: string): Promise<any[]> => {
  const response = await axios.get(API_URL + 'search?q=' + query);
  return response.data;
};