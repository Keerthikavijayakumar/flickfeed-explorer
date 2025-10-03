import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { userService } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, userData, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  
  console.log('Profile component render - isEditing:', isEditing, 'userData:', !!userData);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    preferences: {
      genres: [] as string[],
      languages: [] as string[]
    }
  });

  useEffect(() => {
    console.log('Profile userData changed:', userData);
    if (userData) {
      const newFormData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        age: userData.age?.toString() || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: userData.gender || '',
        bio: userData.bio || '',
        preferences: {
          genres: userData.preferences?.genres || [],
          languages: userData.preferences?.languages || []
        }
      };
      console.log('Setting form data:', newFormData);
      setFormData(newFormData);
    }
  }, [userData]);

  const movieGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 
    'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Fantasy', 'Crime'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese',
    'Korean', 'Chinese', 'Hindi', 'Arabic', 'Portuguese', 'Russian'
  ];

  const handleSave = async () => {
    if (!user) {
      alert('User not authenticated. Please log in again.');
      return;
    }
    
    try {
      setLoading(true);
      setSaveStatus('Preparing data...');
      
      // Prepare update data with proper validation
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        gender: formData.gender,
        bio: formData.bio.trim(),
        preferences: {
          genres: formData.preferences.genres || [],
          languages: formData.preferences.languages || []
        },
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        lastUpdated: new Date() // Add timestamp for tracking
      };
      
      console.log('Saving user profile data:', updateData);
      console.log('User ID:', user.uid);
      
      setSaveStatus('Saving to database...');
      // Save to Firestore
      await userService.updateUser(user.uid, updateData);
      console.log('Profile data saved to Firestore successfully');
      
      setSaveStatus('Verifying save...');
      // Verify the data was saved by fetching it back
      const updatedUserData = await userService.getUser(user.uid);
      console.log('Verified saved data:', updatedUserData);
      
      if (!updatedUserData) {
        throw new Error('Failed to verify saved data');
      }
      
      setSaveStatus('Refreshing profile...');
      // Refresh user data in auth context
      await refreshUserData();
      console.log('Auth context refreshed');
      
      setIsEditing(false);
      setSaveStatus('Profile saved successfully!');
      
      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus(`Error: ${error.message}`);
      alert(`Failed to update profile: ${error.message}. Please try again.`);
      
      // Clear error status after 5 seconds
      setTimeout(() => setSaveStatus(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked');
    // Reset form data to original values
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        age: userData.age?.toString() || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        gender: userData.gender || '',
        bio: userData.bio || '',
        preferences: {
          genres: userData.preferences?.genres || [],
          languages: userData.preferences?.languages || []
        }
      });
    }
    setIsEditing(false);
    console.log('Set isEditing to false');
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        genres: prev.preferences.genres.includes(genre)
          ? prev.preferences.genres.filter(g => g !== genre)
          : [...prev.preferences.genres, genre]
      }
    }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        languages: prev.preferences.languages.includes(language)
          ? prev.preferences.languages.filter(l => l !== language)
          : [...prev.preferences.languages, language]
      }
    }));
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  const getInitials = () => {
    const first = userData.firstName?.[0] || '';
    const last = userData.lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  const getSubscriptionBadgeColor = () => {
    switch (userData.subscription?.plan) {
      case 'premium':
        return 'bg-purple-500';
      case 'ultra':
        return 'bg-gold-500';
      case 'basic':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="text-right">
            {/* Save status indicator */}
            {saveStatus && (
              <div className={`text-sm mb-1 ${
                saveStatus.includes('Error') ? 'text-red-500' : 
                saveStatus.includes('successfully') ? 'text-green-500' : 'text-blue-500'
              }`}>
                {saveStatus}
              </div>
            )}
            {/* Debug indicator */}
            <span className="text-xs text-muted-foreground">
              Mode: {isEditing ? 'Editing' : 'Viewing'}
              {userData?.lastUpdated && (
                <> • Updated: {new Date(userData.lastUpdated).toLocaleString()}</>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={userData.photoURL || ''} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mt-4">
                {userData.firstName} {userData.lastName}
              </h2>
              
              <div className="flex justify-center mt-2">
                <Badge className={`${getSubscriptionBadgeColor()} text-white`}>
                  {userData.subscription?.plan?.toUpperCase()} Plan
                </Badge>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>📧 {userData.email || userData.phone}</p>
                <p>🎂 Age: {userData.age}</p>
                <p>📅 Member since {new Date(userData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              
              {!isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">First Name</Label>
                    <p className="font-medium">{userData.firstName || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Last Name</Label>
                    <p className="font-medium">{userData.lastName || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Age</Label>
                    <p className="font-medium">{userData.age || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                    <p className="font-medium">
                      {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Gender</Label>
                    <p className="font-medium">{userData.gender || 'Not set'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">Bio</Label>
                    <p className="font-medium">{userData.bio || 'No bio added'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="13"
                        max="120"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Favorite Genres</Label>
                  {!isEditing ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userData.preferences?.genres?.length ? (
                        userData.preferences.genres.map(genre => (
                          <Badge key={genre} variant="secondary">{genre}</Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No preferences set</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {movieGenres.map(genre => (
                        <Button
                          key={genre}
                          type="button"
                          variant={formData.preferences.genres.includes(genre) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Preferred Languages</Label>
                  {!isEditing ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {userData.preferences?.languages?.length ? (
                        userData.preferences.languages.map(language => (
                          <Badge key={language} variant="secondary">{language}</Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No preferences set</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {languages.map(language => (
                        <Button
                          key={language}
                          type="button"
                          variant={formData.preferences.languages.includes(language) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleLanguage(language)}
                        >
                          {language}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Subscription Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Subscription</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Current Plan</Label>
                  <p className="font-medium">{userData.subscription?.plan?.toUpperCase()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className="font-medium">{userData.subscription?.status?.toUpperCase()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Start Date</Label>
                  <p className="font-medium">
                    {userData.subscription?.startDate ? new Date(userData.subscription.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">End Date</Label>
                  <p className="font-medium">
                    {userData.subscription?.endDate ? new Date(userData.subscription.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <Button className="mt-4" variant="outline">
                Manage Subscription
              </Button>
            </Card>
          </div>
        </div>

        {/* Edit Profile Button - Bottom of Page */}
        <div className="mt-8 flex justify-center">
          {!isEditing ? (
            <Button 
              onClick={() => {
                console.log('Edit button clicked, current isEditing:', isEditing);
                setIsEditing(true);
                console.log('Set isEditing to true');
              }}
              size="lg"
              className="w-full max-w-md"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-4 w-full max-w-md">
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={loading}
                size="lg"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                size="lg"
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

