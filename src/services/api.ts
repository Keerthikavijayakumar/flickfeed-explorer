import axios from 'axios';
import { 
  MovieResponse, 
  MovieDetails, 
  TVShowResponse, 
  TVShowDetails, 
  SearchResponse, 
  VideosResponse, 
  CreditsResponse,
  Movie,
  TVShow
} from '../types/movie';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'b8058a3ca0209dfabe0a564646dc1a46';

console.log('🎬 TMDB API integrated successfully!');
console.log('🔑 API Key:', API_KEY ? 'Present' : 'Missing');

const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Image URL helpers
export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500') => {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') => {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Movie API functions
export const movieApi = {
  // Get trending movies
  getTrending: async (timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse> => {
    try {
      const response = await api.get(`/trending/movie/${timeWindow}`);
      console.log('🎬 Trending movies fetched:', response.data.results.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopular: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await api.get('/movie/popular', { params: { page } });
      console.log('🎬 Popular movies fetched:', response.data.results.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRated: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/top_rated', { params: { page } });
    return response.data;
  },

  // Get now playing movies
  getNowPlaying: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/now_playing', { params: { page } });
    return response.data;
  },

  // Get upcoming movies
  getUpcoming: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/movie/upcoming', { params: { page } });
    return response.data;
  },

  // Get movies by genre
  getByGenre: async (genreId: number, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/discover/movie', { 
      params: { 
        with_genres: genreId,
        page 
      } 
    });
    return response.data;
  },

  // Get movie details
  getDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get movie videos
  getVideos: async (movieId: number): Promise<VideosResponse> => {
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  // Get movie credits
  getCredits: async (movieId: number): Promise<CreditsResponse> => {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data;
  },

  // Get similar movies
  getSimilar: async (movieId: number, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get(`/movie/${movieId}/similar`, { params: { page } });
    return response.data;
  },

  // Get recommended movies
  getRecommendations: async (movieId: number, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get(`/movie/${movieId}/recommendations`, { params: { page } });
    return response.data;
  },
};

// TV Show API functions
export const tvApi = {
  // Get trending TV shows
  getTrending: async (timeWindow: 'day' | 'week' = 'week'): Promise<TVShowResponse> => {
    const response = await api.get(`/trending/tv/${timeWindow}`);
    return response.data;
  },

  // Get popular TV shows
  getPopular: async (page: number = 1): Promise<TVShowResponse> => {
    const response = await api.get('/tv/popular', { params: { page } });
    return response.data;
  },

  // Get top rated TV shows
  getTopRated: async (page: number = 1): Promise<TVShowResponse> => {
    const response = await api.get('/tv/top_rated', { params: { page } });
    return response.data;
  },

  // Get TV shows by genre
  getByGenre: async (genreId: number, page: number = 1): Promise<TVShowResponse> => {
    const response = await api.get('/discover/tv', { 
      params: { 
        with_genres: genreId,
        page 
      } 
    });
    return response.data;
  },

  // Get TV show details
  getDetails: async (tvId: number): Promise<TVShowDetails> => {
    const response = await api.get(`/tv/${tvId}`);
    return response.data;
  },

  // Get TV show videos
  getVideos: async (tvId: number): Promise<VideosResponse> => {
    const response = await api.get(`/tv/${tvId}/videos`);
    return response.data;
  },

  // Get TV show credits
  getCredits: async (tvId: number): Promise<CreditsResponse> => {
    const response = await api.get(`/tv/${tvId}/credits`);
    return response.data;
  },

  // Get similar TV shows
  getSimilar: async (tvId: number, page: number = 1): Promise<TVShowResponse> => {
    const response = await api.get(`/tv/${tvId}/similar`, { params: { page } });
    return response.data;
  },

  // Get recommended TV shows
  getRecommendations: async (tvId: number, page: number = 1): Promise<TVShowResponse> => {
    const response = await api.get(`/tv/${tvId}/recommendations`, { params: { page } });
    return response.data;
  },
};

// Search API functions
export const searchApi = {
  // Search movies and TV shows
  searchMulti: async (query: string, page: number = 1): Promise<SearchResponse> => {
    const response = await api.get('/search/multi', { 
      params: { 
        query, 
        page,
        include_adult: false 
      } 
    });
    return response.data;
  },

  // Search movies only
  searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
    const response = await api.get('/search/movie', { 
      params: { 
        query, 
        page,
        include_adult: false 
      } 
    });
    return response.data;
  },

  // Search TV shows only
  searchTV: async (query: string, page: number = 1): Promise<TVShowResponse> => {
    const response = await api.get('/search/tv', { 
      params: { 
        query, 
        page,
        include_adult: false 
      } 
    });
    return response.data;
  },
};

// Genre API functions
export const genreApi = {
  // Get movie genres
  getMovieGenres: async () => {
    const response = await api.get('/genre/movie/list');
    return response.data;
  },

  // Get TV show genres
  getTVGenres: async () => {
    const response = await api.get('/genre/tv/list');
    return response.data;
  },
};

// Utility functions
export const getYouTubeUrl = (videoKey: string) => {
  return `https://www.youtube.com/watch?v=${videoKey}`;
};

export const getYouTubeEmbedUrl = (videoKey: string) => {
  // Add autoplay and modest branding so trailers start playing when opened in the player
  return `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1`;
};

export const getYouTubeSearchUrl = (title: string) => {
  const q = encodeURIComponent(`${title} trailer`);
  return `https://www.youtube.com/results?search_query=${q}`;
};

export const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default api;
