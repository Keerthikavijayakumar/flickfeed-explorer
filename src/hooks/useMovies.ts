import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { movieApi, tvApi, searchApi, genreApi } from '../services/api';
import { Movie, TVShow, MovieDetails, TVShowDetails, SearchResponse } from '../types/movie';

// Movie hooks
export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'week') => {
  return useQuery({
    queryKey: ['trending-movies', timeWindow],
    queryFn: () => movieApi.getTrending(timeWindow),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['popular-movies', page],
    queryFn: () => movieApi.getPopular(page),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTopRatedMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['top-rated-movies', page],
    queryFn: () => movieApi.getTopRated(page),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useNowPlayingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['now-playing-movies', page],
    queryFn: () => movieApi.getNowPlaying(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpcomingMovies = (page: number = 1) => {
  return useQuery({
    queryKey: ['upcoming-movies', page],
    queryFn: () => movieApi.getUpcoming(page),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMoviesByGenre = (genreId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['movies-by-genre', genreId, page],
    queryFn: () => movieApi.getByGenre(genreId, page),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: ['movie-details', movieId],
    queryFn: () => movieApi.getDetails(movieId),
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useMovieVideos = (movieId: number) => {
  return useQuery({
    queryKey: ['movie-videos', movieId],
    queryFn: () => movieApi.getVideos(movieId),
    enabled: !!movieId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useMovieCredits = (movieId: number) => {
  return useQuery({
    queryKey: ['movie-credits', movieId],
    queryFn: () => movieApi.getCredits(movieId),
    enabled: !!movieId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useSimilarMovies = (movieId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['similar-movies', movieId, page],
    queryFn: () => movieApi.getSimilar(movieId, page),
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRecommendedMovies = (movieId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['recommended-movies', movieId, page],
    queryFn: () => movieApi.getRecommendations(movieId, page),
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// TV Show hooks
export const useTrendingTVShows = (timeWindow: 'day' | 'week' = 'week') => {
  return useQuery({
    queryKey: ['trending-tv', timeWindow],
    queryFn: () => tvApi.getTrending(timeWindow),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularTVShows = (page: number = 1) => {
  return useQuery({
    queryKey: ['popular-tv', page],
    queryFn: () => tvApi.getPopular(page),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTopRatedTVShows = (page: number = 1) => {
  return useQuery({
    queryKey: ['top-rated-tv', page],
    queryFn: () => tvApi.getTopRated(page),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useTVShowsByGenre = (genreId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['tv-by-genre', genreId, page],
    queryFn: () => tvApi.getByGenre(genreId, page),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useTVShowDetails = (tvId: number) => {
  return useQuery({
    queryKey: ['tv-details', tvId],
    queryFn: () => tvApi.getDetails(tvId),
    enabled: !!tvId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useTVShowVideos = (tvId: number) => {
  return useQuery({
    queryKey: ['tv-videos', tvId],
    queryFn: () => tvApi.getVideos(tvId),
    enabled: !!tvId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useTVShowCredits = (tvId: number) => {
  return useQuery({
    queryKey: ['tv-credits', tvId],
    queryFn: () => tvApi.getCredits(tvId),
    enabled: !!tvId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useSimilarTVShows = (tvId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['similar-tv', tvId, page],
    queryFn: () => tvApi.getSimilar(tvId, page),
    enabled: !!tvId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRecommendedTVShows = (tvId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['recommended-tv', tvId, page],
    queryFn: () => tvApi.getRecommendations(tvId, page),
    enabled: !!tvId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Search hooks
export const useSearchMulti = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['search-multi', query, page],
    queryFn: () => searchApi.searchMulti(query, page),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['search-movies', query, page],
    queryFn: () => searchApi.searchMovies(query, page),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchTVShows = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['search-tv', query, page],
    queryFn: () => searchApi.searchTV(query, page),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Infinite query hooks for pagination
export const useInfinitePopularMovies = () => {
  return useInfiniteQuery({
    queryKey: ['infinite-popular-movies'],
    queryFn: ({ pageParam = 1 }) => movieApi.getPopular(pageParam),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInfiniteSearchMulti = (query: string) => {
  return useInfiniteQuery({
    queryKey: ['infinite-search-multi', query],
    queryFn: ({ pageParam = 1 }) => searchApi.searchMulti(query, pageParam),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Genre hooks
export const useMovieGenres = () => {
  return useQuery({
    queryKey: ['movie-genres'],
    queryFn: () => genreApi.getMovieGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useTVGenres = () => {
  return useQuery({
    queryKey: ['tv-genres'],
    queryFn: () => genreApi.getTVGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

