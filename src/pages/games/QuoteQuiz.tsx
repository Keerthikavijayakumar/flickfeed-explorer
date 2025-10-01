import { useState, useEffect } from 'react';
import { Film, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { movieApi } from '@/services/api';
import { Movie } from '@/types/movie';

// Hardcoded movie quotes since we don't have a quotes API
const movieQuotes = [
  {
    quote: "I'll be back.",
    movie: "The Terminator",
    year: 1984
  },
  {
    quote: "May the Force be with you.",
    movie: "Star Wars",
    year: 1977
  },
  {
    quote: "I'm the king of the world!",
    movie: "Titanic",
    year: 1997
  },
  {
    quote: "Life is like a box of chocolates.",
    movie: "Forrest Gump",
    year: 1994
  },
  {
    quote: "Here's looking at you, kid.",
    movie: "Casablanca",
    year: 1942
  },
  {
    quote: "I feel the need... the need for speed!",
    movie: "Top Gun",
    year: 1986
  },
  {
    quote: "You're gonna need a bigger boat.",
    movie: "Jaws",
    year: 1975
  },
  {
    quote: "To infinity and beyond!",
    movie: "Toy Story",
    year: 1995
  },
  {
    quote: "Elementary, my dear Watson.",
    movie: "Sherlock Holmes",
    year: 1939
  },
  {
    quote: "There's no place like home.",
    movie: "The Wizard of Oz",
    year: 1939
  }
];

export const QuoteQuiz = () => {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularMovies = await movieApi.getPopular();
        setMovies(popularMovies.results);
        generateOptions(0, popularMovies.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const generateOptions = (quoteIndex: number, moviesList: Movie[]) => {
    const correctMovie = movieQuotes[quoteIndex].movie;
    const wrongMovies = moviesList
      .map(m => m.title)
      .filter(title => title !== correctMovie)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setOptions([correctMovie, ...wrongMovies].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (answer: string) => {
    if (answer === movieQuotes[currentQuote].movie) {
      setScore(score + 1);
    }

    if (currentQuote < movieQuotes.length - 1) {
      setCurrentQuote(currentQuote + 1);
      generateOptions(currentQuote + 1, movies);
    } else {
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setCurrentQuote(0);
    setScore(0);
    setShowResult(false);
    generateOptions(0, movies);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Film className="h-16 w-16 animate-spin text-netflix-red mx-auto" />
          <p className="text-white">Loading quotes...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">Movie Quote Quiz</h1>
          <p className="text-gray-400">Match the famous quote to its movie!</p>
        </div>

        <div className="bg-netflix-surface/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          {!showResult ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg text-white">
                  Quote {currentQuote + 1} of {movieQuotes.length}
                </div>
                <div className="text-netflix-red font-semibold">
                  Score: {score}
                </div>
              </div>

              <div className="text-2xl text-white mb-8 text-center p-6 bg-black/30 rounded-lg border border-white/10">
                "{movieQuotes[currentQuote].quote}"
                <div className="text-sm text-gray-400 mt-2">
                  Year: {movieQuotes[currentQuote].year}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((movie, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-4 text-left hover:bg-white/10 transition-colors duration-300"
                    onClick={() => handleAnswer(movie)}
                  >
                    {movie}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <Film className="h-16 w-16 mx-auto text-netflix-red" />
              <h3 className="text-2xl font-bold text-white">
                You scored {score} out of {movieQuotes.length}!
              </h3>
              <p className="text-gray-300">
                {score === movieQuotes.length ? "Perfect! You're a movie quotes master! 🎬" :
                score > movieQuotes.length / 2 ? "Great job! You know your movie quotes! 🎥" :
                "Keep watching more classic movies! 🍿"}
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Exit Game
                </Button>
                <Button
                  className="bg-netflix-red hover:bg-red-700 transition-colors"
                  onClick={resetGame}
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteQuiz;