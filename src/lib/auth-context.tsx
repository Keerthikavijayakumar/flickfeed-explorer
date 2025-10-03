import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from './firebase';
import { userService, UserData } from './userService';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithPhone: (phone: string, userDetails: any) => Promise<void>;
  signInWithPhone: (phone: string) => Promise<ConfirmationResult>;
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<User>;
  signOut: () => Promise<void>;
  setupRecaptcha: (elementId: string) => RecaptchaVerifier;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Starting auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 AuthProvider: Auth state changed', firebaseUser ? 'User logged in' : 'User logged out');
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          console.log('🔐 AuthProvider: Fetching user data from Firestore for UID:', firebaseUser.uid);
          const data = await userService.getUser(firebaseUser.uid);
          
          if (data) {
            console.log('🔐 AuthProvider: User data found:', data);
            setUserData(data);
            
            // Update last login time
            await userService.updateUser(firebaseUser.uid, { lastLogin: new Date() });
          } else {
            console.warn('🔐 AuthProvider: No user data found in Firestore, user may need to complete profile');
            // Set minimal user data if no profile exists
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              phone: firebaseUser.phoneNumber,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              firstName: null,
              lastName: null,
              age: null,
              dateOfBirth: null,
              gender: null,
              bio: null,
              preferences: { genres: [], languages: [] },
              subscription: {
                plan: 'free',
                status: 'trial',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              },
              myList: [],
              createdAt: new Date(),
              lastLogin: new Date()
            });
          }
          
          console.log('🔐 AuthProvider: User data set successfully');
        } catch (error) {
          console.error('Could not fetch user data from Firestore:', error);
          // Set basic user data if Firestore fails
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            phone: firebaseUser.phoneNumber,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            firstName: null,
            lastName: null,
            age: null,
            dateOfBirth: null,
            gender: null,
            bio: null,
            preferences: { genres: [], languages: [] },
            subscription: {
              plan: 'free',
              status: 'trial',
              startDate: new Date(),
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            myList: [],
            createdAt: new Date(),
            lastLogin: new Date()
          });
          console.log('🔐 AuthProvider: Using fallback user data');
        }
      } else {
        setUserData(null);
        console.log('🔐 AuthProvider: No user, clearing user data');
      }

      console.log('🔐 AuthProvider: Setting loading to false');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    try {
      await userService.createUser(firebaseUser);
      const data = await userService.getUser(firebaseUser.uid);
      setUserData(data);
    } catch (error) {
      console.warn('Could not create user data in Firestore:', error);
      // Set basic user data if Firestore fails
      setUserData({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        myList: [],
        createdAt: new Date(),
        lastLogin: new Date()
      });
    }

    setUser(firebaseUser);
    return firebaseUser;
  };

  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    try {
      const data = await userService.getUser(firebaseUser.uid);
      setUserData(data);
    } catch (error) {
      console.warn('Could not fetch user data from Firestore:', error);
      // Set basic user data if Firestore fails
      setUserData({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        myList: [],
        createdAt: new Date(),
        lastLogin: new Date()
      });
    }

    setUser(firebaseUser);
    return firebaseUser;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserData(null);
  };

  const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
    // Clear any existing reCAPTCHA
    const existingRecaptcha = document.getElementById(elementId);
    if (existingRecaptcha) {
      existingRecaptcha.innerHTML = '';
    }
    
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
      'error-callback': (error: any) => {
        console.error('reCAPTCHA error:', error);
      }
    });
  };

  const signInWithPhone = async (phone: string): Promise<ConfirmationResult> => {
    const recaptchaVerifier = setupRecaptcha('recaptcha-container');
    const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    return confirmation;
  };

  const signUpWithPhone = async (phone: string, userDetails: any): Promise<void> => {
    // For signup, we'll use the same phone sign-in process
    // The user details will be stored after verification
    const recaptchaVerifier = setupRecaptcha('recaptcha-container');
    const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    // Store confirmation and userDetails temporarily for after verification
    window.tempUserDetails = userDetails;
    window.tempConfirmation = confirmation;
  };

  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string): Promise<User> => {
    const result = await confirmationResult.confirm(code);
    const firebaseUser = result.user;

    // Check if this is a new user (signup) with temp details
    const tempUserDetails = window.tempUserDetails;
    if (tempUserDetails) {
      try {
        console.log('Creating new user with details:', tempUserDetails);
        await userService.createPhoneUser(firebaseUser, tempUserDetails);
        const data = await userService.getUser(firebaseUser.uid);
        console.log('User data created and fetched:', data);
        setUserData(data);
        // Clear temp data
        window.tempUserDetails = null;
        window.tempConfirmation = null;
      } catch (error) {
        console.error('Could not create user data in Firestore:', error);
        // Fallback: create basic user data
        setUserData({
          uid: firebaseUser.uid,
          email: null,
          phone: firebaseUser.phoneNumber,
          displayName: `${tempUserDetails.firstName} ${tempUserDetails.lastName}`,
          photoURL: firebaseUser.photoURL,
          firstName: tempUserDetails.firstName,
          lastName: tempUserDetails.lastName,
          age: tempUserDetails.age,
          dateOfBirth: tempUserDetails.dateOfBirth ? new Date(tempUserDetails.dateOfBirth) : null,
          gender: tempUserDetails.gender,
          bio: tempUserDetails.bio,
          preferences: tempUserDetails.preferences,
          subscription: {
            plan: 'free',
            status: 'trial',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          myList: [],
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
    } else {
      // Existing user login
      try {
        const data = await userService.getUser(firebaseUser.uid);
        setUserData(data);
        if (data) {
          // Update last login
          await userService.updateUser(firebaseUser.uid, { lastLogin: new Date() });
        }
      } catch (error) {
        console.warn('Could not fetch user data from Firestore:', error);
      }
    }

    setUser(firebaseUser);
    return firebaseUser;
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        console.log('Refreshing user data for UID:', user.uid);
        const data = await userService.getUser(user.uid);
        console.log('Fetched fresh user data:', data);
        setUserData(data);
        
        // Also update last login time
        if (data) {
          await userService.updateUser(user.uid, { lastLogin: new Date() });
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signUpWithPhone,
        signInWithPhone,
        verifyPhoneCode,
        setupRecaptcha,
        signOut,
        refreshUserData,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
