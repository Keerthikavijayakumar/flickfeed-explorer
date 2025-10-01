import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SimpleVideoPlayer = () => {
  const { movieId, mediaType } = useParams();
  const navigate = useNavigate();

  console.log('🎬 SimpleVideoPlayer - movieId:', movieId, 'mediaType:', mediaType);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {/* Simple Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-900" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center max-w-2xl mx-auto px-8">
            <div className="mb-8">
              <div className="w-32 h-32 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Video Player Test
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Movie ID: {movieId} | Media Type: {mediaType || 'movie'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate(-1)} 
                variant="secondary"
                size="lg"
                className="px-8 py-3"
              >
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="btn-netflix px-8 py-3"
                size="lg"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};




