import { 
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  myList: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export const userService = {
  async createUserProfile(user: User): Promise<UserProfile> {
    const userRef = doc(db, 'users', user.uid);
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      myList: [],
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    await setDoc(userRef, userProfile);
    return userProfile;
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  },

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  },

  async addToMyList(uid: string, movieId: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const userProfile = await this.getUserProfile(uid);
    
    if (userProfile && !userProfile.myList.includes(movieId)) {
      await updateDoc(userRef, {
        myList: [...userProfile.myList, movieId]
      });
    }
  },

  async removeFromMyList(uid: string, movieId: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const userProfile = await this.getUserProfile(uid);
    
    if (userProfile) {
      await updateDoc(userRef, {
        myList: userProfile.myList.filter(id => id !== movieId)
      });
    }
  }
};