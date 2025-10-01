import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MovieCard } from '@/components/MovieCard';
import { useSearchMulti } from '@/hooks/useMovies';
import { Movie, TVShow } from '@/types/movie';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';

interface SearchResultsProps {
  searchQuery: string;
  searchResults: (Movie | TVShow)[];
  onAddToList: (movie: Movie | TVShow) => void;
}

export const SearchResults = ({ searchQuery, searchResults, onAddToList }: SearchResultsProps) => {
  const location = useLocation();
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [location.search]);

  // Use the API search hook
  const { data: searchData, isLoading, error } = useSearchMulti(query);

  // Use API results if available, otherwise fall back to props
  const results = searchData?.results || searchResults;
  const totalResults = searchData?.total_results || results.length;

  // Loading skeleton
  const SearchSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-64 rounded-lg" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {query ? `Search results for "${query}"` : 'Search'}
          </h1>
          <p className="text-gray-400">
            {isLoading ? 'Searching...' : `${totalResults} ${totalResults === 1 ? 'result' : 'results'} found`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-8 border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Failed to load search results. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <SearchSkeleton />}

        {/* Search Results */}
        {!isLoading && !error && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((item) => (
              <MovieCard
                key={item.id}
                movie={item}
                onAddToList={onAddToList}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && results.length === 0 && query && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">No results found</h2>
            <p className="text-gray-400 mb-6">
              Try searching for something else or check your spelling.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !query && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">Start searching</h2>
            <p className="text-gray-400">
              Use the search bar to find movies and TV shows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};