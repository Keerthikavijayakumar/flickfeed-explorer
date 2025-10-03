import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ThumbsDown, Share, ArrowLeft, Calendar, Clock, Star, Users, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/Carousel';
import { useMovieDetails, useMovieCredits, useMovieVideos, useSimilarMovies, useRecommendedMovies } from '@/hooks/useMovies';
import { Movie, TVShow } from '@/types/movie';
import { getImageUrl, getBackdropUrl, formatDate, formatRuntime, formatCurrency } from '@/services/api';
import { tubiIntegration, getStreamingSearchUrls } from '@/services/streaming-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MovieDetailProps {
  onAddToList: (movie: Movie | TVShow) => void;
  myList: (Movie | TVShow)[];
}

export const MovieDetail = ({ onAddToList, myList }: MovieDetailProps) => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  // Fetch movie details and related data
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieDetails(Number(movieId));
  const { data: credits, isLoading: creditsLoading } = useMovieCredits(Number(movieId));
  const { data: videos, isLoading: videosLoading } = useMovieVideos(Number(movieId));
  const { data: similarMovies, isLoading: similarLoading } = useSimilarMovies(Number(movieId));
  const { data: recommendedMovies, isLoading: recommendedLoading } = useRecommendedMovies(Number(movieId));

  const isInMyList = movie && myList.some(m => m.id === movie.id);
  
  // Check if movie might be available on Tubi
  const isPotentiallyOnTubi = movie ? tubiIntegration.isPotentiallyAvailable(movie) : false;
  const streamingUrls = movie ? getStreamingSearchUrls(movie.title, movie.release_date?.split('-')[0]) : null;

  const handlePlay = () => {
    if (movie) {
      navigate(`/player/movie/${movie.id}`);
    }
  };

  const handleAddToList = () => {
    if (movie) {
      onAddToList(movie);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <Skeleton className="h-20 w-full mb-8" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (movieError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <Alert className="border-red-500 bg-red-500/10 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Failed to load movie details. Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Movie not found</h2>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Blurred Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center blurred-bg"
          style={{
            backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'original')})`,
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 pb-12 animate-fade-in">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Hero Section with Floating Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Movie Poster */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <img
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  className="w-full max-w-md rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              </div>
            </div>
            
            {/* Floating Info Card */}
            <div className="lg:col-span-3">
              <div className="floating-card rounded-2xl p-8 animate-scale-in">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {movie.title}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-300">
                  <span className="text-netflix-red font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(movie.release_date)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatRuntime(movie.runtime)}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-1 border border-gray-500 rounded text-xs">
                    {movie.adult ? '18+' : 'All Ages'}
                  </span>
                </div>
                
                <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                  {movie.overview}
                </p>
                
                {/* Streaming Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-200">
                      <strong>Streaming Info:</strong> This platform shows movie trailers and information. 
                      To watch the full movie, use the buttons below to discover legal streaming options.
                    </div>
                  </div>
                </div>

                {/* Tubi Availability Notice */}
                {isPotentiallyOnTubi && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-white">T</span>
                      </div>
                      <div className="text-sm text-green-200">
                        <strong>Free on Tubi:</strong> This movie might be available for free on Tubi! 
                        Click "Watch Free on Tubi" to check availability.
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button
                    onClick={handlePlay}
                    className="btn-netflix flex items-center gap-2 text-lg px-8 py-3 rounded-lg font-semibold"
                  >
                    <Play className="h-6 w-6" fill="white" />
                    Play Trailer
                  </Button>
                  
                  {/* Tubi Button - Show prominently if potentially available */}
                  {isPotentiallyOnTubi && streamingUrls && (
                    <Button
                      onClick={() => window.open(streamingUrls.tubi, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-lg px-8 py-3 rounded-lg font-semibold"
                    >
                      <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">T</span>
                      </div>
                      Watch Free on Tubi
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => streamingUrls && window.open(streamingUrls.justWatch, '_blank')}
                    variant="secondary"
                    className="btn-secondary flex items-center gap-2 text-lg px-8 py-3 rounded-lg font-semibold"
                  >
                    <ExternalLink className="h-6 w-6" />
                    Find Where to Watch
                  </Button>
                  
                  <Button
                    onClick={handleAddToList}
                    variant="secondary"
                    className={`btn-secondary flex items-center gap-2 text-lg px-8 py-3 rounded-lg font-semibold ${
                      isInMyList ? 'opacity-75' : ''
                    }`}
                    disabled={isInMyList}
                  >
                    <Plus className="h-6 w-6" />
                    {isInMyList ? 'Added to List' : 'Add to List'}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-secondary rounded-full w-12 h-12 p-0"
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-secondary rounded-full w-12 h-12 p-0"
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-secondary rounded-full w-12 h-12 p-0"
                    >
                      <Share className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Movie Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Details</h3>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="text-gray-400 w-20 inline-block">Genres:</span> {movie.genres?.map(g => g.name).join(', ')}</p>
                      <p><span className="text-gray-400 w-20 inline-block">Release:</span> {formatDate(movie.release_date)}</p>
                      <p><span className="text-gray-400 w-20 inline-block">Runtime:</span> {formatRuntime(movie.runtime)}</p>
                      <p><span className="text-gray-400 w-20 inline-block">Rating:</span> ★ {movie.vote_average.toFixed(1)}/10</p>
                      <p><span className="text-gray-400 w-20 inline-block">Budget:</span> {formatCurrency(movie.budget)}</p>
                      <p><span className="text-gray-400 w-20 inline-block">Revenue:</span> {formatCurrency(movie.revenue)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-lg">Cast & Crew</h3>
                    <div className="space-y-2 text-gray-300">
                      {creditsLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ) : (
                        <>
                          <p><span className="text-gray-400 w-20 inline-block">Director:</span> {credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A'}</p>
                          <p><span className="text-gray-400 w-20 inline-block">Writers:</span> {credits?.crew?.filter(c => c.job === 'Writer' || c.job === 'Screenplay').slice(0, 2).map(c => c.name).join(', ') || 'N/A'}</p>
                          <p><span className="text-gray-400 w-20 inline-block">Stars:</span> {credits?.cast?.slice(0, 3).map(c => c.name).join(', ') || 'N/A'}</p>
                          <p><span className="text-gray-400 w-20 inline-block">Studio:</span> {movie.production_companies?.[0]?.name || 'N/A'}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Movies Carousel */}
        {!similarLoading && similarMovies?.results && similarMovies.results.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Carousel
              title="Similar Movies"
              movies={similarMovies.results}
              onAddToList={onAddToList}
            />
          </div>
        )}

        {/* Recommended Movies Carousel */}
        {!recommendedLoading && recommendedMovies?.results && recommendedMovies.results.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Carousel
              title="You Might Also Like"
              movies={recommendedMovies.results}
              onAddToList={onAddToList}
            />
          </div>
        )}
      </div>
    </div>
  );
};