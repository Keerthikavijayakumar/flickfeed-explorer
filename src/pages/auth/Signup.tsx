import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';
import { ConfirmationResult } from 'firebase/auth';

export default function Signup() {
  const navigate = useNavigate();
  const { signUpWithPhone, verifyPhoneCode } = useAuth();
  
  // Phone and verification
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<'details' | 'phone' | 'verify'>('details');
  
  // User details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);

  const validateDetails = () => {
    if (!firstName.trim() || !lastName.trim() || !age || !dateOfBirth || !gender) {
      alert('Please fill in all required fields');
      return false;
    }
    if (parseInt(age) < 13) {
      alert('You must be at least 13 years old to sign up');
      return false;
    }
    return true;
  };

  const handleContinueToPhone = () => {
    if (!validateDetails()) return;
    setStep('phone');
  };

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const userDetails = {
        firstName,
        lastName,
        age: parseInt(age),
        dateOfBirth,
        gender,
        bio,
        preferences: {
          genres: preferredGenres,
          languages: preferredLanguages
        }
      };
      
      await signUpWithPhone(phone, userDetails);
      setStep('verify');
      console.log('SMS sent successfully');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        alert('Phone authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/billing-not-enabled') {
        alert('For real phone numbers, Firebase billing must be enabled. Use test number: +1 555-123-4567 with code: 123456');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Too many requests. Please try again later.');
      } else if (error.code === 'auth/invalid-phone-number') {
        alert('Invalid phone number format. Please use international format (+1234567890).');
      } else {
        alert(`Failed to send SMS: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) {
      // Get confirmation from window global if not set
      const tempConfirmation = window.tempConfirmation;
      if (!tempConfirmation) {
        alert('No confirmation result found. Please try again.');
        return;
      }
      setConfirmationResult(tempConfirmation);
    }
    
    try {
      setLoading(true);
      const confirmation = confirmationResult || window.tempConfirmation;
      const user = await verifyPhoneCode(confirmation, verificationCode);
      console.log('Signed up user:', user);
      navigate('/subscription');
    } catch (error: any) {
      console.error('Verification error:', error);
      alert('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleContinueToPhone();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendCode();
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyCode();
  };

  const movieGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 
    'Sci-Fi', 'Thriller', 'Documentary', 'Animation', 'Fantasy', 'Crime'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese',
    'Korean', 'Chinese', 'Hindi', 'Arabic', 'Portuguese', 'Russian'
  ];

  const toggleGenre = (genre: string) => {
    setPreferredGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleLanguage = (language: string) => {
    setPreferredLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-2">
            {step === 'details' && 'Tell us about yourself'}
            {step === 'phone' && 'Verify your phone number'}
            {step === 'verify' && 'Enter verification code'}
          </p>
        </div>

        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={gender} onValueChange={setGender}>
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
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your movie preferences..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label>Favorite Genres (Optional)</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {movieGenres.map(genre => (
                  <Button
                    key={genre}
                    type="button"
                    variant={preferredGenres.includes(genre) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Preferred Languages (Optional)</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {languages.map(language => (
                  <Button
                    key={language}
                    type="button"
                    variant={preferredLanguages.includes(language) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLanguage(language)}
                  >
                    {language}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Continue to Phone Verification
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="underline text-primary">
                Log in
              </Link>
            </div>
          </form>
        )}

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number (e.g., +1234567890)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 For testing: +1 555-123-4567 (code: 123456)
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('details')}
              >
                Back to Details
              </Button>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Create Account'}
            </Button>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('phone')}
              >
                Change phone number
              </Button>
            </div>
          </form>
        )}
        
        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </Card>
    </div>
  );
}
