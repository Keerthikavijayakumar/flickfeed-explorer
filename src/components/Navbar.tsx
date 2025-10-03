import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Menu, X, Gamepad2, Award, Brain, Dice1, Film, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useAuth } from '@/lib/auth-context';
import { ProfileDropdown } from '@/components/ProfileDropdown';

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isScrolled } = useScrollPosition();
  const { user, signOut } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      navigate('/search');
      setIsSearchOpen(false);
    }
  };

  const handleLogoClick = () => {
    console.log('🏠 Logo clicked, navigating to home');
    navigate('/');
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'navbar-solid' : 'navbar-transparent'
    }`} style={{ backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="text-2xl font-bold text-netflix-red hover:text-red-600 transition-colors"
            >
              NetFlix
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 ml-10">
            <button 
              onClick={() => navigate('/')}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/browse')}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Browse
            </button>
            <button 
              onClick={() => navigate('/lucky')}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              Feeling Lucky?
            </button>
            
            <button 
              onClick={() => navigate('/my-list')}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              My List
            </button>
            {/* Games Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:text-muted-foreground transition-colors p-0"
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span>Games</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-netflix-surface border-border">
                <DropdownMenuItem className="group" onClick={() => navigate('/games/trivia')}>
                  <Award className="mr-2 h-4 w-4 text-netflix-red group-hover:text-white transition-colors" />
                  Movie Trivia
                </DropdownMenuItem>
                <DropdownMenuItem className="group" onClick={() => navigate('/games/guess')}>
                  <Brain className="mr-2 h-4 w-4 text-netflix-red group-hover:text-white transition-colors" />
                  Guess the Movie
                </DropdownMenuItem>
                <DropdownMenuItem className="group" onClick={() => navigate('/games/quotes')}>
                  <Film className="mr-2 h-4 w-4 text-netflix-red group-hover:text-white transition-colors" />
                  Quote Quiz
                </DropdownMenuItem>
                <DropdownMenuItem className="group" onClick={() => navigate('/games/shuffle')}>
                  <Dice1 className="mr-2 h-4 w-4 text-netflix-red group-hover:text-white transition-colors" />
                  Scene Shuffle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>

          {/* Desktop Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Enhanced Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Titles, people, genres"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`search-expanded bg-netflix-surface border-border text-white placeholder:text-gray-400`}
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) {
                        setTimeout(() => setIsSearchOpen(false), 150);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:bg-white/10 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="hover:bg-white/10 transition-colors">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Conditional Auth Section */}
            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button className="btn-netflix" size="sm" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hover:bg-white/10 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <button
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
            <div className="w-full max-w-md px-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search movies and shows"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-netflix-surface border-border text-white placeholder:text-gray-400 text-lg py-3"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''} md:hidden`}>
          <div className="px-4 py-6 space-y-4">
            <button 
              onClick={() => { navigate('/'); closeMobileMenu(); }}
              className="block text-foreground hover:text-netflix-red transition-colors text-lg py-2 w-full text-left"
            >
              Home
            </button>
              <button 
                onClick={() => { navigate('/landing'); closeMobileMenu(); }}
                className="block text-foreground hover:text-netflix-red transition-colors text-lg py-2 w-full text-left"
              >
                Landing
              </button>
            
            <button 
              onClick={() => { navigate('/lucky'); closeMobileMenu(); }}
              className="block text-foreground hover:text-netflix-red transition-colors text-lg py-2 w-full text-left"
            >
              Feeling Lucky?
            </button>
            <button 
              onClick={() => { navigate('/my-list'); closeMobileMenu(); }}
              className="block text-foreground hover:text-netflix-red transition-colors text-lg py-2 w-full text-left"
            >
              My List
            </button>
            <div className="py-2">
              <div className="text-sm text-muted-foreground mb-2 px-2">Games</div>
              <button 
                onClick={() => { navigate('/games/trivia'); closeMobileMenu(); }}
                className="flex items-center text-foreground hover:text-netflix-red transition-colors py-2 w-full text-left pl-2"
              >
                <Award className="mr-2 h-4 w-4" />
                Movie Trivia
              </button>
              <button 
                onClick={() => { navigate('/games/guess'); closeMobileMenu(); }}
                className="flex items-center text-foreground hover:text-netflix-red transition-colors py-2 w-full text-left pl-2"
              >
                <Brain className="mr-2 h-4 w-4" />
                Guess the Movie
              </button>
              <button 
                onClick={() => { navigate('/games/quotes'); closeMobileMenu(); }}
                className="flex items-center text-foreground hover:text-netflix-red transition-colors py-2 w-full text-left pl-2"
              >
                <Film className="mr-2 h-4 w-4" />
                Quote Quiz
              </button>
              <button 
                onClick={() => { navigate('/games/shuffle'); closeMobileMenu(); }}
                className="flex items-center text-foreground hover:text-netflix-red transition-colors py-2 w-full text-left pl-2"
              >
                <Dice1 className="mr-2 h-4 w-4" />
                Scene Shuffle
              </button>
            </div>
            <hr className="border-border" />
            {user ? (
              <div className="space-y-2">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-white">{user.displayName || user.email}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => { 
                    navigate('/profile'); 
                    closeMobileMenu(); 
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => { 
                    navigate('/subscription'); 
                    closeMobileMenu(); 
                  }}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Subscription
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-400 hover:text-red-300" 
                  onClick={() => { 
                    signOut(); 
                    closeMobileMenu(); 
                    navigate('/'); 
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="ghost" onClick={() => { navigate('/login'); closeMobileMenu(); }}>
                  Login
                </Button>
                <Button className="btn-netflix" onClick={() => { navigate('/signup'); closeMobileMenu(); }}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};