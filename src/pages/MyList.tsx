import { useState, useEffect } from 'react';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import { useNavigate } from 'react-router-dom';

export const MyList = ({ myList, onAddToList }: { myList: Movie[]; onAddToList: (movie: Movie) => void }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8 animate-slide-up">My List</h1>
        
        {myList.length === 0 ? (
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <div className="mb-6 animate-scale-in">
                <div className="w-32 h-32 bg-gradient-to-br from-netflix-red to-netflix-red/60 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <span className="text-6xl">📺</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6 animate-fade-in">Your list is empty, start adding shows!</h2>
              <p className="text-gray-400 text-lg mb-10 animate-fade-in leading-relaxed">
                Discover amazing movies and TV shows, then add them to your personal collection. 
                <br />
                Your watchlist will appear here for easy access anytime.
              </p>
              <a 
                href="/"
                className="btn-netflix inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl animate-fade-in"
              >
                <span className="text-2xl">🎬</span>
                Start Browsing
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 animate-fade-in">
              <p className="text-gray-400 text-lg">
                {myList.length} {myList.length === 1 ? 'title' : 'titles'} in your collection
              </p>
              <div className="text-sm text-gray-500">
                Swipe left on mobile to remove items
              </div>
            </div>
            
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-fade-in">
              {myList.map((movie, index) => (
                <div
                  key={movie.id}
                  className="relative group animate-slide-up"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <MovieCard
                    movie={movie}
                    onAddToList={() => removeFromMyList(movie.id.toString())}
                    isInList={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};