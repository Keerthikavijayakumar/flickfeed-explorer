import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMovieDetails } from '@/hooks/useMovies';
import { getBackdropUrl } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const DemoVideoPlayer = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(true);
  const [showTitleOverlay, setShowTitleOverlay] = useState(true);

  // Fetch movie details
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieDetails(Number(movieId));

  // Demo video URL (you can replace this with any sample video)
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
      setShowTitleOverlay(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mb-4 mx-auto" />
          <Skeleton className="h-4 w-32 mb-6 mx-auto" />
          <Skeleton className="h-12 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  // Error state
  if (movieError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Alert className="border-red-500 bg-red-500/10 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              Failed to load movie details. Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Movie not found</h2>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'original')})`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Demo Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={demoVideoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        poster={getBackdropUrl(movie.backdrop_path, 'original')}
      />

      {/* Title Overlay */}
      {showTitleOverlay && (
        <div className="absolute top-6 left-6 z-30">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-3">
            <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
            <p className="text-sm text-gray-300">Demo Video • {movie.release_date?.split('-')[0]}</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`video-controls ${!showControls ? 'video-controls-hidden' : ''} absolute inset-0`}>
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

        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full w-24 h-24 opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            {isPlaying ? (
              <Pause className="h-12 w-12" fill="white" />
            ) : (
              <Play className="h-12 w-12" fill="white" />
            )}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 z-20">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full h-2 cursor-pointer"
            />
            <div className="flex justify-between text-sm text-white mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 rounded-full w-12 h-12"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" fill="white" />
                ) : (
                  <Play className="h-6 w-6" fill="white" />
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/movie/${movieId}`)}
                className="text-white hover:bg-white/20"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
