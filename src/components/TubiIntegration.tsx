import React from 'react';
import { ExternalLink, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tubiIntegration } from '@/services/streaming-service';
import { Movie } from '@/types/movie';

interface TubiIntegrationProps {
  movie: Movie;
  className?: string;
}

export const TubiIntegration: React.FC<TubiIntegrationProps> = ({ movie, className = '' }) => {
  const isPotentiallyAvailable = tubiIntegration.isPotentiallyAvailable(movie);
  const tubiSearchUrl = tubiIntegration.getSearchUrl(movie.title, movie.release_date?.split('-')[0]);
  const genreBrowseUrl = movie.genres?.[0] ? tubiIntegration.getBrowseUrl(movie.genres[0].name) : tubiIntegration.getBrowseUrl();

  if (!isPotentiallyAvailable) {
    return null;
  }

  return (
    <Card className={`bg-green-500/10 border-green-500/20 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-white">T</span>
          </div>
          <div>
            <CardTitle className="text-green-400 text-lg">Available on Tubi</CardTitle>
            <CardDescription className="text-green-200">
              This movie might be free to watch with ads
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            Free with Ads
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            No Subscription Required
          </Badge>
          {movie.vote_average >= 7 && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              <Star className="w-3 h-3 mr-1" />
              Highly Rated
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => window.open(tubiSearchUrl, '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch on Tubi
          </Button>
          
          <Button
            onClick={() => window.open(genreBrowseUrl, '_blank')}
            variant="outline"
            className="border-green-500/50 text-green-400 hover:bg-green-500/10 w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Browse Similar
          </Button>
        </div>

        <div className="text-xs text-green-300/80 mt-3">
          <p>
            <strong>About Tubi:</strong> Free streaming service with thousands of movies and TV shows. 
            Supported by ads, no subscription required. Available in the US, Canada, Australia, and Mexico.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Tubi Browse Component for discovering free movies
interface TubiBrowseProps {
  genres?: string[];
  className?: string;
}

export const TubiBrowse: React.FC<TubiBrowseProps> = ({ genres = [], className = '' }) => {
  const popularGenres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 
    'Romance', 'Documentary', 'Family', 'Animation'
  ];

  return (
    <Card className={`bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <div>
            <CardTitle className="text-green-400">Discover Free Movies on Tubi</CardTitle>
            <CardDescription className="text-green-200">
              Thousands of movies and shows, completely free with ads
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {popularGenres.map((genre) => (
            <Button
              key={genre}
              onClick={() => window.open(tubiIntegration.getBrowseUrl(genre), '_blank')}
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-300 hover:bg-green-500/10 text-xs"
            >
              {genre}
            </Button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => window.open('https://tubitv.com/movies', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Browse All Movies
          </Button>
          
          <Button
            onClick={() => window.open('https://tubitv.com/tv', '_blank')}
            variant="outline"
            className="border-green-500/50 text-green-400 hover:bg-green-500/10 flex-1"
          >
            TV Shows
          </Button>
        </div>

        <div className="text-xs text-green-300/70 pt-2 border-t border-green-500/20">
          <p>
            Tubi is completely free and legal. No credit card required. 
            Just create an account and start watching immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TubiIntegration;








