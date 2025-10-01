import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';
import { userService, UserData } from './userService';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
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
          console.log('🔐 AuthProvider: Fetching user data from Firestore');
          const data = await userService.getUser(firebaseUser.uid);
          setUserData(data);
          console.log('🔐 AuthProvider: User data fetched successfully');
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

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signOut,
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
