import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { ConfirmationResult } from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithPhone, verifyPhoneCode } = useAuth();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'verify'>('phone');

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const confirmation = await signInWithPhone(phone);
      setConfirmationResult(confirmation);
      setStep('verify');
      console.log('SMS sent successfully');
    } catch (error: any) {
      console.error('Phone login error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        alert('Phone authentication is not enabled. Please contact support or use email login.');
      } else if (error.code === 'auth/billing-not-enabled') {
        alert('For real phone numbers, Firebase billing must be enabled. Use test number: +1 555-123-4567 with code: 123456');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Too many requests. Please try again later.');
      } else if (error.code === 'auth/invalid-phone-number') {
        alert('Invalid phone number format. Please use international format (+1234567890).');
      } else {
        alert('Failed to send SMS. Please check your phone number and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;
    
    try {
      setLoading(true);
      const user = await verifyPhoneCode(confirmationResult, verificationCode);
      console.log('Signed in user:', user);
      navigate('/browse');
    } catch (error) {
      console.error('Verification error:', error);
      alert('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendCode();
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyCode();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to FlickFeed Explorer</h1>
          <p className="text-muted-foreground mt-2">
            {step === 'phone' ? 'Enter your phone number' : 'Enter verification code'}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
            <div>
              <Input
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

            <div className="text-center text-sm text-muted-foreground space-y-2">
              <div>
                Don't have an account?{' '}
                <Link to="/signup" className="underline text-primary">
                  Create one
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                Having issues with phone auth?{' '}
                <button 
                  onClick={() => alert('Email authentication temporarily unavailable. Please ensure phone auth is enabled in Firebase Console.')}
                  className="underline text-primary"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="mt-6 space-y-4">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-muted-foreground"
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
