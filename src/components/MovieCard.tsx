import { useState } from 'react';
import { Play, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Movie } from '@/types/movie';
import { getImageUrl, formatDate } from '@/services/api';

interface MovieCardProps {
  movie: Movie;
  onAddToList: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onAddToList }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/player/movie/${movie.id}`);
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToList(movie);
  };

  return (
    <div
      className="relative group cursor-pointer flex-shrink-0 w-48 sm:w-52 md:w-56 lg:w-60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleMoreInfo}
    >
      {/* Movie Thumbnail Container */}
      <div className="relative rounded-lg overflow-hidden movie-card aspect-[2/3]">
        {/* Lazy Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 lazy-placeholder rounded-lg" />
        )}
        
        {/* Movie Image */}
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Enhanced Overlay with Gradient */}
        <div className="movie-card-overlay">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="movie-card-actions">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handlePlay}
                className="btn-netflix rounded-full w-10 h-10 p-0 shadow-lg transform hover:scale-110 transition-transform"
              >
                <Play className="h-4 w-4" fill="white" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAddToList}
                className="bg-white/20 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0 backdrop-blur-sm shadow-lg transform hover:scale-110 transition-transform"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMoreInfo}
              className="bg-white/20 text-white hover:bg-white/30 rounded-full w-10 h-10 p-0 backdrop-blur-sm shadow-lg transform hover:scale-110 transition-transform"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Enhanced Movie Info */}
          <div className="mt-3">
            <h3 className="font-semibold text-white text-sm mb-1 truncate">
              {movie.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span>{formatDate(movie.release_date)}</span>
              <span>•</span>
              <span className="flex items-center">
                ★ {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Always Visible Info on Mobile */}
      <div className={`mt-3 px-2 md:hidden transition-opacity duration-300`}>
        <h3 className="font-semibold text-white text-sm mb-1 truncate">
          {movie.title}
        </h3>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{formatDate(movie.release_date)}</span>
          <span>•</span>
          <span>★ {movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};