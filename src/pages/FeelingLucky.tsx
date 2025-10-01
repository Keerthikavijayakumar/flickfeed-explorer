import { useNavigate } from 'react-router-dom';
import { Dice1, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePopularMovies } from '@/hooks/useMovies';

const FeelingLucky = () => {
  const navigate = useNavigate();
  const { data: popular } = usePopularMovies();

  const pickRandom = () => {
    const list = popular?.results || [];
    if (list.length === 0) return;
    const random = list[Math.floor(Math.random() * list.length)];
    navigate(`/player/movie/${random.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          Feeling adventurous?
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">Feeling Lucky?</h1>
        <p className="text-gray-400 max-w-xl mx-auto">Click below to jump right into a random popular title. Great for movie nights when no one can decide.</p>
        <Button onClick={pickRandom} className="btn-netflix px-8 py-6 text-lg inline-flex items-center gap-3">
          <Dice1 className="h-6 w-6" /> Surprise Me
        </Button>
      </div>
    </div>
  );
};

export default FeelingLucky;


