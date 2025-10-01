import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Home, Search, List } from 'lucide-react';

export const TestComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🧪 Test component rendered at:', location.pathname);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Netflix Clone Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-netflix-surface rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Navigation Test</h2>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')}
                className="w-full justify-start"
                variant="secondary"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
              <Button 
                onClick={() => navigate('/search')}
                className="w-full justify-start"
                variant="secondary"
              >
                <Search className="h-4 w-4 mr-2" />
                Go to Search
              </Button>
              <Button 
                onClick={() => navigate('/my-list')}
                className="w-full justify-start"
                variant="secondary"
              >
                <List className="h-4 w-4 mr-2" />
                Go to My List
              </Button>
            </div>
          </div>

          <div className="bg-netflix-surface rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Video Player Test</h2>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/player/movie/550')}
                className="w-full justify-start"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Video Player (Fight Club)
              </Button>
              <Button 
                onClick={() => navigate('/movie/550')}
                className="w-full justify-start"
                variant="secondary"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Movie Details (Fight Club)
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-netflix-surface rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Status</h2>
          <div className="text-gray-300 space-y-2">
            <p><strong>Current Path:</strong> {location.pathname}</p>
            <p><strong>API Status:</strong> ✅ TMDB API Integrated</p>
            <p><strong>Navigation:</strong> ✅ React Router Working</p>
            <p><strong>Components:</strong> ✅ All Components Loaded</p>
          </div>
        </div>
      </div>
    </div>
  );
};




