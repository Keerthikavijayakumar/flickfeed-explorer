import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import FeelingLucky from "./pages/FeelingLucky";
import MovieTrivia from "./pages/games/MovieTrivia";
import GuessTheMovie from "./pages/games/GuessTheMovie";
import QuoteQuiz from "./pages/games/QuoteQuiz";
import SceneShuffle from "./pages/games/SceneShuffle";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import { MovieDetail } from "./pages/MovieDetail";
import { VideoPlayer } from "./components/VideoPlayer";
import { MyList } from "./pages/MyList";
import { SearchResults } from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import { Movie, TVShow } from "./types/movie";
import { ErrorBoundary } from "./components/ErrorBoundary";
// Test and game routes removed for clean demo

// Configure QueryClient with better error handling and logging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Component to handle landing page with auth redirect
const LandingPage = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/browse" replace />;
  }
  
  return <Landing />;
};

// Wrapper: if already authenticated, send to /browse instead of showing children (e.g., Login page)
const AuthRedirectIfLoggedIn = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }
  if (user) return <Navigate to="/browse" replace />;
  return <>{children}</>;
};

const App = () => {
  const [myList, setMyList] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);

  console.log('🚀 App component rendered');

  // Load My List from localStorage on app start
  useEffect(() => {
    const savedList = localStorage.getItem('netflix-my-list');
    if (savedList) {
      setMyList(JSON.parse(savedList));
    }
  }, []);

  // Save My List to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('netflix-my-list', JSON.stringify(myList));
  }, [myList]);

  // Handle adding/removing movies from My List
  const handleAddToList = (item: Movie) => {
    setMyList(prev => {
      const isAlreadyInList = prev.some(m => m.id === item.id);
      if (isAlreadyInList) {
        return prev.filter(m => m.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <div className="min-h-screen bg-background">
                <Navbar onSearch={handleSearch} />
                <Routes>
                  {/* Public/Landing/Auth (frontend-only) */}
                  <Route 
                    path="/login" 
                    element={<AuthRedirectIfLoggedIn><Login /></AuthRedirectIfLoggedIn>} 
                  />
                  <Route 
                    path="/signup" 
                    element={<AuthRedirectIfLoggedIn><Signup /></AuthRedirectIfLoggedIn>} 
                  />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Make Landing the homepage with auth redirect */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/lucky" element={<FeelingLucky />} />
                  <Route 
                    path="/browse" 
                    element={
                      <ProtectedRoute>
                        <Index onAddToList={handleAddToList} myList={myList} />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/movie/:movieId" 
                    element={<MovieDetail onAddToList={handleAddToList} myList={myList} />} 
                  />
                  <Route 
                    path="/player/:mediaType/:movieId" 
                    element={<VideoPlayer />} 
                  />
                  <Route 
                    path="/player/:movieId" 
                    element={<VideoPlayer />} 
                  />
                  <Route path="/my-list" element={<MyList myList={myList} onAddToList={handleAddToList} />} />
                  <Route 
                    path="/search" 
                    element={
                      <SearchResults 
                        searchQuery={searchQuery}
                        searchResults={searchResults}
                        onAddToList={handleAddToList}
                      />
                    } 
                  />
                  {/* TV Shows route removed */}
                  {/* Games */}
                  <Route path="/games/trivia" element={<MovieTrivia />} />
                  <Route path="/games/guess" element={<GuessTheMovie />} />
                  <Route path="/games/quotes" element={<QuoteQuiz />} />
                  <Route path="/games/shuffle" element={<SceneShuffle />} />
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;