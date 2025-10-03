import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMovieDetails, useMovieVideos } from '@/hooks/useMovies';
import { getBackdropUrl, getYouTubeEmbedUrl, getYouTubeUrl } from '@/services/api';
import { tubiIntegration, getStreamingSearchUrls } from '@/services/streaming-service';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const VideoPlayer = () => {
	const { movieId } = useParams();
	const navigate = useNavigate();
	const [videoUrl, setVideoUrl] = useState<string>('');
	const [showTrailer, setShowTrailer] = useState(false);
	const [showTitleOverlay, setShowTitleOverlay] = useState(true);

	// Validate movieId
	const validMovieId = movieId && !isNaN(Number(movieId)) ? Number(movieId) : null;

	const goBack = () => {
		try {
			if (window.history.length > 1) {
				navigate(-1);
			} else {
				navigate('/');
			}
		} catch {
			if (window && window.history) {
				window.history.back();
			} else {
				navigate('/');
			}
		}
	};

	if (!validMovieId) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-4">
					<h2 className="text-2xl font-bold mb-4 text-white">Invalid Movie ID</h2>
					<p className="text-gray-400 mb-6">The movie ID "{movieId}" is not valid.</p>
					<Button onClick={() => navigate('/')}>Go Back Home</Button>
				</div>
			</div>
		);
	}

	// Fetch movie details and videos only if we have a valid movieId
	const { data: movie, isLoading: movieLoading, error: movieError } = useMovieDetails(validMovieId);
	const { data: videos, isLoading: videosLoading, error: videosError } = useMovieVideos(validMovieId);
	
	// Check Tubi availability and get streaming URLs
	const isPotentiallyOnTubi = movie ? tubiIntegration.isPotentiallyAvailable(movie) : false;
	const streamingUrls = movie ? getStreamingSearchUrls(movie.title, movie.release_date?.split('-')[0]) : null;

	// Select a YouTube video
	useEffect(() => {
		if (videos?.results && videos.results.length > 0) {
			const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
			const teaser = videos.results.find(v => v.type === 'Teaser' && v.site === 'YouTube');
			const anyVideo = videos.results.find(v => v.site === 'YouTube');
			const selected = trailer || teaser || anyVideo;
			if (selected) {
				setVideoUrl(getYouTubeEmbedUrl(selected.key));
				setShowTrailer(true);
			} else {
				setShowTrailer(false);
			}
		} else {
			setShowTrailer(false);
		}
	}, [videos]);

	// Hide title overlay after 3 seconds
	useEffect(() => {
		const t = setTimeout(() => setShowTitleOverlay(false), 3000);
		return () => clearTimeout(t);
	}, []);

	// Loading state
	if (movieLoading || videosLoading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="relative w-full h-screen bg-black overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-900 animate-gradient-xy" />
					<div className="absolute inset-0 flex items-center justify-center z-10">
						<div className="text-center p-8 backdrop-blur-lg bg-black/30 rounded-xl border border-white/10 shadow-2xl">
							<div className="relative w-32 h-32 mx-auto mb-6">
								<div className="absolute inset-0 bg-netflix-red rounded-full animate-ping opacity-25" />
								<div className="relative w-full h-full bg-netflix-red rounded-full flex items-center justify-center animate-pulse">
									<Play className="h-16 w-16 text-white" />
								</div>
							</div>
							<h1 className="text-4xl font-bold text-white mb-2">Loading...</h1>
							<p className="text-gray-300">Fetching movie details and videos</p>
						</div>
					</div>
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
						<AlertDescription className="text-red-400">
							Failed to load movie details. Error: {movieError.message}
						</AlertDescription>
					</Alert>
					<Button onClick={() => navigate('/')}>Go Back Home</Button>
				</div>
			</div>
		);
	}

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

	// Fallback when no trailer is available
	if (!showTrailer || !videoUrl) {
		return (
			<div className="min-h-screen bg-background">
				<div className="relative w-full h-screen bg-black overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center transform scale-105 animate-ken-burns"
						style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'original')})` }}
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 backdrop-blur-sm" />
					
					{/* Content */}
					<div className="absolute inset-0 flex items-center justify-center z-10">
						<div className="text-center max-w-2xl mx-auto px-8">
							<div className="mb-8">
								<div className="w-32 h-32 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-netflix-red">
									<AlertTriangle className="h-16 w-16 text-netflix-red" />
								</div>
							</div>
							<h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
								{movie.title}
							</h1>
							<p className="text-xl text-gray-300 mb-8">
								Full movie not available for streaming
							</p>
							
							<Alert className="border-yellow-500 bg-yellow-500/10 mb-8 text-left">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription className="text-yellow-400">
									<strong>Note:</strong> This platform shows movie information and trailers from TMDB. 
									Full movies require subscriptions to legal streaming services like Netflix, Amazon Prime, or Hulu.
								</AlertDescription>
							</Alert>

							<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
								{/* Tubi Button - Show prominently if potentially available */}
								{isPotentiallyOnTubi && streamingUrls && (
									<Button 
										onClick={() => window.open(streamingUrls.tubi, '_blank')} 
										className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
										size="lg"
									>
										<div className="w-5 h-5 bg-white rounded flex items-center justify-center mr-2">
											<span className="text-xs font-bold text-green-600">T</span>
										</div>
										Watch Free on Tubi
									</Button>
								)}
								
								<Button 
									onClick={() => streamingUrls ? window.open(streamingUrls.justWatch, '_blank') : window.open(`https://www.google.com/search?q=${encodeURIComponent(movie.title + ' ' + movie.release_date?.split('-')[0])} watch online`, '_blank')} 
									className="btn-netflix px-8 py-3"
									size="lg"
								>
									<ExternalLink className="h-5 w-5 mr-2" />
									Find Where to Watch
								</Button>
								<Button 
									onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' ' + movie.release_date?.split('-')[0] + ' trailer')}`, '_blank')} 
									variant="secondary"
									size="lg"
									className="px-8 py-3"
								>
									<Play className="h-5 w-5 mr-2" />
									Search for Trailer
								</Button>
							</div>

							<div className="flex gap-4 justify-center">
								<Button 
									onClick={goBack} 
									variant="ghost"
									size="lg"
									className="px-8 py-3 text-white hover:bg-white/20"
								>
									<ArrowLeft className="h-5 w-5 mr-2" />
									Go Back
								</Button>
							</div>
						</div>
					</div>

					<div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-20">
						<Button variant="ghost" size="sm" onClick={goBack} className="text-white hover:bg-white/20 transition-colors">
							<ArrowLeft className="h-5 w-5 mr-2" />
							Back
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-screen bg-black overflow-hidden">
			<iframe
				src={videoUrl}
				className="w-full h-full"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
				allowFullScreen
				title={movie.title}
			/>

			{showTitleOverlay && (
				<div className="absolute top-6 left-6 z-30">
					<div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-3">
						<h1 className="text-2xl font-bold text-white">{movie.title}</h1>
						<p className="text-sm text-gray-300">{movie.release_date?.split('-')[0]} • {movie.genres?.[0]?.name}</p>
					</div>
				</div>
			)}

			<div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-20">
				<Button variant="ghost" size="sm" onClick={goBack} className="text-white hover:bg-white/20 transition-colors">
					<ArrowLeft className="h-5 w-5 mr-2" />
					Back
				</Button>
			</div>
		</div>
	);
};