import { useEffect, useState } from 'react';
import { Play, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Movie } from '@/types/movie';
import { getBackdropUrl, getImageUrl, formatDate } from '@/services/api';

interface HeroBannerProps {
  movies: Movie[];
  onAddToList: (movie: Movie) => void;
}

export const HeroBanner = ({ movies, onAddToList }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const currentMovie = movies[currentIndex];

  // Auto-rotate movies every 8 seconds
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
        setIsTransitioning(false);
      }, 500); // Half of transition duration
    }, 8000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const handlePlay = () => {
    if (currentMovie) {
      const mediaType = 'title' in currentMovie ? 'movie' : 'tv';
      navigate(`/player/${mediaType}/${currentMovie.id}`);
    }
  };

  const handleMoreInfo = () => {
    if (currentMovie) {
      const mediaType = 'title' in currentMovie ? 'movie' : 'tv';
      navigate(`/${mediaType}/${currentMovie.id}`);
    }
  };

  const handleAddToList = () => {
    if (currentMovie) {
      onAddToList(currentMovie);
    }
  };

  if (!currentMovie) return null;

  return (
    <section className="relative h-screen flex items-center justify-start overflow-hidden">
      {/* Background Image with Fade Animation */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backgroundImage: `url(${getBackdropUrl(currentMovie.backdrop_path, 'original')})`,
        }}
      />
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      {/* Content with Fade Animation */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 transition-opacity duration-500 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight animate-slide-up">
            {currentMovie.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex items-center space-x-4 mb-6 text-sm text-gray-300 animate-fade-in">
            <span>{formatDate(currentMovie.release_date)}</span>
            <span>•</span>
            <span className="flex items-center">
              ★ {currentMovie.vote_average.toFixed(1)}
            </span>
            <span>•</span>
            <span>{currentMovie.adult ? '18+' : 'All Ages'}</span>
          </div>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl animate-fade-in">
            {currentMovie.overview}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button
              onClick={handlePlay}
              className="btn-netflix flex items-center gap-2 text-lg px-8 py-3 rounded-md font-semibold"
            >
              <Play className="h-6 w-6" fill="white" />
              Play
            </Button>
            
            <Button
              onClick={handleMoreInfo}
              variant="secondary"
              className="btn-secondary flex items-center gap-2 text-lg px-8 py-3 rounded-md font-semibold"
            >
              <Info className="h-6 w-6" />
              More Info
            </Button>
            
            <Button
              onClick={handleAddToList}
              variant="ghost"
              className="btn-secondary flex items-center gap-2 text-lg px-6 py-3 rounded-md"
            >
              <Plus className="h-6 w-6" />
              My List
            </Button>
          </div>
        </div>
      </div>

      {/* Movie Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 right-8 z-20 flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`View movie ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};