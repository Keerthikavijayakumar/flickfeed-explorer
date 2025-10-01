import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from './MovieCard';
import { useTouchSwipe } from '@/hooks/useTouchSwipe';
import { Movie } from '@/types/movie';

interface CarouselProps {
  title: string;
  movies: Movie[];
  onAddToList: (movie: Movie) => void;
}

export const Carousel = ({ title, movies, onAddToList }: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = scrollRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Touch/swipe support
  const swipeHandlers = useTouchSwipe({
    onSwipeLeft: () => scroll('right'),
    onSwipeRight: () => scroll('left'),
  });

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        
        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          {/* Movies Scroll Container with Enhanced Scrolling */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 carousel-container"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            {...swipeHandlers}
          >
            {movies.map((movie, index) => (
              <div key={movie.id} className="carousel-item">
                <MovieCard
                  movie={movie}
                  onAddToList={onAddToList}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};