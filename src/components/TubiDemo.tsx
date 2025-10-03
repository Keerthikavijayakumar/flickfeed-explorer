import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Play, Star, Clock, Calendar } from 'lucide-react';

// Demo component showing how Tubi integration works
export const TubiDemo: React.FC = () => {
  const demoMovies = [
    {
      title: "The Pursuit of Happyness",
      year: "2006",
      rating: 8.0,
      genre: "Drama",
      likelihood: "High",
      reason: "Older drama, moderate budget, high rating"
    },
    {
      title: "John Wick",
      year: "2014", 
      rating: 7.4,
      genre: "Action",
      likelihood: "Medium",
      reason: "Popular but older action film"
    },
    {
      title: "The Babadook",
      year: "2014",
      rating: 6.8,
      genre: "Horror",
      likelihood: "High",
      reason: "Independent horror film, perfect for Tubi"
    }
  ];

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'High': return 'bg-green-500/20 text-green-300';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'Low': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <div>
              <CardTitle className="text-green-400 text-xl">Tubi Integration Demo</CardTitle>
              <CardDescription className="text-green-200">
                See how our smart detection algorithm works
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">How It Works:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Analyzes movie age (older = more likely on Tubi)</li>
                <li>• Checks budget size (lower budget = higher chance)</li>
                <li>• Considers rating range (moderate ratings typical)</li>
                <li>• Evaluates studio type (independent films favored)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-white text-lg font-semibold">Example Movies & Predictions:</h3>
        
        {demoMovies.map((movie, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold">{movie.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {movie.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {movie.rating}
                    </span>
                    <span>{movie.genre}</span>
                  </div>
                </div>
                
                <Badge className={getLikelihoodColor(movie.likelihood)}>
                  {movie.likelihood} Chance
                </Badge>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{movie.reason}</p>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`https://tubitv.com/search/${encodeURIComponent(movie.title)}`, '_blank')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Check Tubi
                </Button>
                
                <Button
                  onClick={() => window.open(`https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`, '_blank')}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  JustWatch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-white">i</span>
            </div>
            <div className="text-sm text-blue-200">
              <strong>Note:</strong> These are intelligent predictions based on movie characteristics. 
              Actual availability may vary. Always check Tubi directly for confirmation.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TubiDemo;








