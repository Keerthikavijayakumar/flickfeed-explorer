import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, userData, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const displayName = userData?.displayName || user?.displayName || user?.email || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-white/10 transition-colors p-2"
        >
          <div className="w-8 h-8 rounded-full bg-netflix-red flex items-center justify-center text-white text-sm font-semibold">
            {getInitials(userData?.displayName, user?.email)}
          </div>
          <span className="hidden sm:block text-white">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-netflix-surface border-border">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="group cursor-pointer" 
          onClick={() => navigate('/my-list')}
        >
          <Heart className="mr-2 h-4 w-4 text-netflix-red group-hover:text-white transition-colors" />
          My List
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="group cursor-pointer" 
          onClick={() => navigate('/browse')}
        >
          <User className="mr-2 h-4 w-4 text-netflix-red group-hover:text-white transition-colors" />
          Browse
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="group cursor-pointer text-red-400 hover:text-red-300" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

