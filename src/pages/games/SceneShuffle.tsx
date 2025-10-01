import { useState, useEffect } from 'react';
import { Dice1, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { movieApi, getBackdropUrl } from '@/services/api';
import { Movie } from '@/types/movie';

interface Scene {
  id: number;
  image: string;
  description: string;
}

export const SceneShuffle = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [shuffledScenes, setShuffledScenes] = useState<Scene[]>([]);
  const [selectedScenes, setSelectedScenes] = useState<Scene[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    const movie = movieList[Math.floor(Math.random() * movieList.length)];
    setCurrentMovie(movie);
    
    // Generate 4 "scenes" (we'll use the same backdrop with different descriptions)
    const scenes: Scene[] = [
      {
        id: 1,
        image: getBackdropUrl(movie.backdrop_path, 'w780'),
        description: 'Opening Scene'
      },
      {
        id: 2,
        image: getBackdropUrl(movie.backdrop_path, 'w780'),
        description: 'Plot Development'
      },
      {
        id: 3,
        image: getBackdropUrl(movie.backdrop_path, 'w780'),
        description: 'Climax'
      },
      {
        id: 4,
        image: getBackdropUrl(movie.backdrop_path, 'w780'),
        description: 'Resolution'
      }
    ];

    setScenes(scenes);
    setShuffledScenes([...scenes].sort(() => Math.random() - 0.5));
    setSelectedScenes([]);
    setShowResult(false);
  };

  const handleSceneSelect = (scene: Scene) => {
    if (selectedScenes.includes(scene)) return;

    const newSelected = [...selectedScenes, scene];
    setSelectedScenes(newSelected);

    if (newSelected.length === scenes.length) {
      // Check if order is correct
      const isCorrect = newSelected.every((s, i) => s.id === scenes[i].id);
      if (isCorrect) {
        setScore(score + 1);
      }
      setShowResult(true);
    }
  };

  if (isLoading || !currentMovie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Dice1 className="h-16 w-16 animate-spin text-netflix-red mx-auto" />
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
          <h1 className="text-4xl font-bold text-white mb-2">Scene Shuffle</h1>
          <p className="text-gray-400">Arrange the scenes in chronological order!</p>
          <div className="text-xl text-netflix-red font-semibold mt-2">Score: {score}</div>
        </div>

        <div className="bg-netflix-surface/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl text-white mb-6 text-center">{currentMovie.title}</h2>

          {/* Selected Scenes */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {scenes.map((_, index) => (
              <div
                key={index}
                className={`aspect-video rounded-lg border-2 ${selectedScenes[index] ? 'border-netflix-red' : 'border-white/10'} overflow-hidden`}
              >
                {selectedScenes[index] && (
                  <div className="relative h-full">
                    <img
                      src={selectedScenes[index].image}
                      alt={`Scene ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-sm text-white text-center">
                      {selectedScenes[index].description}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Shuffled Scenes */}
          {!showResult ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shuffledScenes.map((scene, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`p-0 h-auto aspect-video overflow-hidden ${selectedScenes.includes(scene) ? 'opacity-50' : 'hover:border-netflix-red'}`}
                  onClick={() => handleSceneSelect(scene)}
                  disabled={selectedScenes.includes(scene)}
                >
                  <div className="relative h-full w-full">
                    <img
                      src={scene.image}
                      alt={`Scene option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-sm text-white">
                      {scene.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-2xl font-bold text-white mb-4">
                {selectedScenes.every((s, i) => s.id === scenes[i].id)
                  ? '🎉 Perfect! You got the order right!'
                  : '😅 Not quite right. Try again!'}
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Exit Game
                </Button>
                <Button
                  className="bg-netflix-red hover:bg-red-700 transition-colors"
                  onClick={() => selectRandomMovie(movies)}
                >
                  Next Movie
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneShuffle;