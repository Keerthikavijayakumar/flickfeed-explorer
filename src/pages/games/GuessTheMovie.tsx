import { useState, useEffect } from 'react';
import { Brain, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { movieApi, getBackdropUrl } from '@/services/api';
import { Movie } from '@/types/movie';

export const GuessTheMovie = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [blurLevel, setBlurLevel] = useState(20);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularMovies = await movieApi.getPopular();
        setMovies(popularMovies.results);
        selectRandomMovie(popularMovies.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const selectRandomMovie = (movieList: Movie[]) => {
    const randomMovie = movieList[Math.floor(Math.random() * movieList.length)];
    setCurrentMovie(randomMovie);
    setGuess('');
    setFeedback('');
    setAttempts(0);
    setBlurLevel(20);
  };

  const checkGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMovie) return;

    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedTitle = currentMovie.title.toLowerCase().trim();
    
    setAttempts(attempts + 1);

    if (normalizedGuess === normalizedTitle) {
      setFeedback('Correct! Well done! 🎉');
      setScore(score + Math.max(5 - attempts, 1));
      setTimeout(() => selectRandomMovie(movies), 2000);
    } else {
      if (attempts >= 3) {
        setBlurLevel(Math.max(blurLevel - 5, 0));
      }
      setFeedback('Try again! 🎬');
    }
  };

  if (isLoading || !currentMovie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-16 w-16 animate-spin text-netflix-red mx-auto" />
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Guess the Movie</h1>
          <p className="text-gray-400">Can you identify the movie from the blurred image?</p>
          <div className="text-xl text-netflix-red font-semibold mt-2">Score: {score}</div>
        </div>

        <div className="bg-netflix-surface/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <div 
            className="w-full h-[400px] bg-cover bg-center rounded-lg mb-6 transition-all duration-500"
            style={{
              backgroundImage: `url(${getBackdropUrl(currentMovie.backdrop_path, 'original')})`,
              filter: `blur(${blurLevel}px)`,
            }}
          />

          <form onSubmit={checkGuess} className="space-y-4">
            <Input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter movie title..."
              className="bg-black/50 border-white/20 text-white placeholder:text-gray-400"
              autoFocus
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Attempts: {attempts} | Hint: {currentMovie.release_date?.split('-')[0]}
              </div>
              <Button 
                type="submit"
                className="bg-netflix-red hover:bg-red-700 transition-colors"
              >
                Submit Guess
              </Button>
            </div>
          </form>

          {feedback && (
            <div className={`mt-4 text-center text-lg ${feedback.includes('Correct') ? 'text-green-500' : 'text-yellow-500'}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessTheMovie;