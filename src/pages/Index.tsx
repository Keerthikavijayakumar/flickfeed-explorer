import { HeroBanner } from '@/components/HeroBanner';
import { Carousel } from '@/components/Carousel';
import { useTrendingMovies, usePopularMovies, useTopRatedMovies, useNowPlayingMovies, useMovieGenres } from '@/hooks/useMovies';
import { Movie } from '@/types/movie';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IndexProps {
  onAddToList: (item: Movie) => void;
  myList: Movie[];
}

const Index = ({ onAddToList, myList }: IndexProps) => {
  console.log('🎬 Index component mounting...');

  // Fetch data from API with error handling
  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useTrendingMovies('week');
  const { data: popularMovies, isLoading: popularLoading, error: popularError } = usePopularMovies();
  const { data: topRatedMovies, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies();
  const { data: nowPlayingMovies, isLoading: nowPlayingLoading, error: nowPlayingError } = useNowPlayingMovies();
  const { data: movieGenres } = useMovieGenres();

  // Filters
  const [selectedGenreId, setSelectedGenreId] = useState<string>('all');

  const filterByGenre = (movies?: { results?: Movie[] }) => {
    if (!movies?.results) return [] as Movie[];
    if (selectedGenreId === 'all') return movies.results;
    const idNum = Number(selectedGenreId);
    return movies.results.filter(m => (m.genre_ids || []).includes(idNum));
  };

  // Log any errors for debugging
  useEffect(() => {
    if (trendingError) console.error('❌ Trending movies error:', trendingError);
    if (popularError) console.error('❌ Popular movies error:', popularError);
    if (topRatedError) console.error('❌ Top rated movies error:', topRatedError);
    if (nowPlayingError) console.error('❌ Now playing movies error:', nowPlayingError);
  }, [trendingError, popularError, topRatedError, nowPlayingError]);

  useEffect(() => {
    console.log('🍿 Index page loaded');
    if (trendingMovies) console.log('🎬 Trending movies:', trendingMovies.results.length);
    if (popularMovies) console.log('🎬 Popular movies:', popularMovies.results.length);
    if (topRatedMovies) console.log('🎬 Top rated movies:', topRatedMovies.results.length);
    if (nowPlayingMovies) console.log('🎬 Now playing movies:', nowPlayingMovies.results.length);
  }, [trendingMovies, popularMovies, topRatedMovies, nowPlayingMovies]);

  // Debug logging
  useEffect(() => {
    console.log('🏠 Index page loaded');
    console.log('📊 Data status:', {
      trending: { loading: trendingLoading, data: !!trendingMovies, error: !!trendingError },
      popular: { loading: popularLoading, data: !!popularMovies, error: !!popularError },
      topRated: { loading: topRatedLoading, data: !!topRatedMovies, error: !!topRatedError },
      nowPlaying: { loading: nowPlayingLoading, data: !!nowPlayingMovies, error: !!nowPlayingError },
    });
  }, [trendingLoading, popularLoading, topRatedLoading, nowPlayingLoading]);

  // Precompute filtered lists (hooks must be top-level, not conditional)
  const filteredTrending = useMemo(() => filterByGenre(trendingMovies), [trendingMovies, selectedGenreId]);
  const filteredPopular = useMemo(() => filterByGenre(popularMovies), [popularMovies, selectedGenreId]);
  const filteredTopRated = useMemo(() => filterByGenre(topRatedMovies), [topRatedMovies, selectedGenreId]);
  const filteredNowPlaying = useMemo(() => filterByGenre(nowPlayingMovies), [nowPlayingMovies, selectedGenreId]);

  // Get featured movies for hero banner (trending movies)
  const featuredMovies = (filteredTrending || []).slice(0, 5);

  // Loading skeleton component
  const CarouselSkeleton = ({ title }: { title: string }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 px-4">{title}</h2>
      <div className="flex space-x-4 px-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-64 h-36 rounded-lg flex-shrink-0" />
        ))}
      </div>
    </div>
  );

  // Show error state if all API calls failed
    const hasAnyData = trendingMovies?.results?.length || popularMovies?.results?.length || 
                     topRatedMovies?.results?.length || nowPlayingMovies?.results?.length;  if (!trendingLoading && !popularLoading && !topRatedLoading && !nowPlayingLoading && 
      !hasAnyData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4 text-white">Unable to load content</h1>
          <p className="text-gray-400 mb-6">
            There was an issue loading movies and TV shows. Please check your internet connection and try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-netflix px-6 py-3 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Filters Bar - sticky and aligned */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-14 flex items-center gap-4">
          <div className="text-sm text-gray-400">Filter by genre</div>
          <Select value={selectedGenreId} onValueChange={setSelectedGenreId}>
            <SelectTrigger className="w-56 bg-netflix-surface border-border text-white">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent className="bg-netflix-surface border-border">
              <SelectItem value="all">All Genres</SelectItem>
              {movieGenres?.genres?.map(g => (
                <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Hero Banner with Auto-Rotate */}
      {featuredMovies.length > 0 && (
        <HeroBanner 
          movies={featuredMovies}
          onAddToList={onAddToList}
        />
      )}
      
      {/* Full set of carousels */}
      <div className="pb-12 -mt-32 relative z-10">
        {/* Trending Movies */}
        {trendingLoading ? (
          <CarouselSkeleton title="Trending Now" />
        ) : (
          <Carousel
            title="Trending Now"
            movies={filteredTrending}
            onAddToList={onAddToList}
          />
        )}
        
        {/* My List */}
        {myList.length > 0 && (
          <Carousel
            title="My List"
            movies={myList}
            onAddToList={onAddToList}
          />
        )}
        
        {/* Popular Movies */}
        {popularLoading ? (
          <CarouselSkeleton title="Popular Movies" />
        ) : (
          <Carousel
            title="Popular Movies"
            movies={filteredPopular}
            onAddToList={onAddToList}
          />
        )}
        
        {/* Top Rated Movies */}
        {topRatedLoading ? (
          <CarouselSkeleton title="Top Rated Movies" />
        ) : (
          <Carousel
            title="Top Rated Movies"
            movies={filteredTopRated}
            onAddToList={onAddToList}
          />
        )}
        
        {/* Now Playing Movies */}
        {nowPlayingLoading ? (
          <CarouselSkeleton title="Now Playing" />
        ) : (
          <Carousel
            title="Now Playing"
            movies={filteredNowPlaying}
            onAddToList={onAddToList}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
