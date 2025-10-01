import { useState, useEffect } from 'react';
import { Award, ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { movieApi } from '@/services/api';
import { Movie } from '@/types/movie';

interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
}

export const MovieTrivia = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularMovies = await movieApi.getPopular();
        setMovies(popularMovies.results);
        generateQuestions(popularMovies.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const generateQuestions = (movies: Movie[]) => {
    const questions: Question[] = [];
    const usedMovies = new Set();

    // Generate release year questions
    for (let i = 0; i < 5; i++) {
      const movie = movies[Math.floor(Math.random() * movies.length)];
      if (!usedMovies.has(movie.id)) {
        usedMovies.add(movie.id);
        const year = movie.release_date?.split('-')[0];
        const answers = [
          year,
          String(Number(year) + 1),
          String(Number(year) - 1),
          String(Number(year) + 2)
        ].sort(() => Math.random() - 0.5);

        questions.push({
          question: `When was "${movie.title}" released?`,
          answers,
          correctAnswer: answers.indexOf(year)
        });
      }
    }

    // Generate movie plot questions
    for (let i = 0; i < 5; i++) {
      const movie = movies[Math.floor(Math.random() * movies.length)];
      if (!usedMovies.has(movie.id)) {
        usedMovies.add(movie.id);
        const correctMovie = movie;
        const wrongMovies = movies
          .filter(m => m.id !== movie.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const answers = [correctMovie, ...wrongMovies]
          .map(m => m.title)
          .sort(() => Math.random() - 0.5);

        questions.push({
          question: `Which movie has this plot: "${correctMovie.overview}"`,
          answers,
          correctAnswer: answers.indexOf(correctMovie.title)
        });
      }
    }

    setQuestions(questions);
  };

  const handleAnswer = (answerIndex: number) => {
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Award className="h-16 w-16 animate-spin text-netflix-red mx-auto" />
          <p className="text-white">Loading trivia questions...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">Movie Trivia Challenge</h1>
          <p className="text-gray-400">Test your knowledge of popular movies!</p>
        </div>

        <div className="bg-netflix-surface/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          {!showResult ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg text-white">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="text-netflix-red font-semibold">
                  Score: {score}
                </div>
              </div>

              <div className="text-xl text-white mb-8">{questions[currentQuestion].question}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-4 text-left hover:bg-white/10 transition-colors duration-300"
                    onClick={() => handleAnswer(index)}
                  >
                    {answer}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">
                You scored {score} out of {questions.length}!
              </h3>
              <p className="text-gray-300">
                {score === questions.length ? "Perfect score! You're a movie expert! 🏆" :
                score > questions.length / 2 ? "Great job! You really know your movies! 🎬" :
                "Keep watching to learn more about movies! 🎥"}
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
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setShowResult(false);
                    generateQuestions(movies);
                  }}
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

export default MovieTrivia;