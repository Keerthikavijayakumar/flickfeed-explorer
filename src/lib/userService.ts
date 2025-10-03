import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  dateOfBirth: Date | null;
  gender: string | null;
  bio: string | null;
  preferences: {
    genres: string[];
    languages: string[];
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'ultra';
    status: 'active' | 'inactive' | 'cancelled' | 'trial';
    startDate: Date | null;
    endDate: Date | null;
  };
  myList: string[];
  createdAt: Date;
  lastLogin: Date;
  lastUpdated?: Date;
}

export const userService = {
  async createUser(user: User): Promise<UserData> {
    const userRef = doc(db, 'users', user.uid);
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      phone: null,
      displayName: user.displayName,
      photoURL: user.photoURL,
      firstName: null,
      lastName: null,
      age: null,
      dateOfBirth: null,
      gender: null,
      bio: null,
      preferences: {
        genres: [],
        languages: []
      },
      subscription: {
        plan: 'free',
        status: 'trial',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days trial
      },
      myList: [],
      createdAt: new Date(),
      lastLogin: new Date()
    };

    await setDoc(userRef, userData);
    return userData;
  },

  async createPhoneUser(user: User, additionalDetails: any): Promise<UserData> {
    const userRef = doc(db, 'users', user.uid);
    const userData: UserData = {
      uid: user.uid,
      email: null,
      phone: user.phoneNumber,
      displayName: additionalDetails.firstName + ' ' + additionalDetails.lastName,
      photoURL: user.photoURL,
      firstName: additionalDetails.firstName,
      lastName: additionalDetails.lastName,
      age: additionalDetails.age,
      dateOfBirth: additionalDetails.dateOfBirth ? new Date(additionalDetails.dateOfBirth) : null,
      gender: additionalDetails.gender,
      bio: additionalDetails.bio || null,
      preferences: {
        genres: additionalDetails.preferences?.genres || [],
        languages: additionalDetails.preferences?.languages || []
      },
      subscription: {
        plan: 'free',
        status: 'trial',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days trial
      },
      myList: [],
      createdAt: new Date(),
      lastLogin: new Date()
    };

    await setDoc(userRef, userData);
    return userData;
  },

  async getUser(uid: string): Promise<UserData | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  },

  async updateUser(uid: string, data: Partial<UserData>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  },

  async addToMyList(uid: string, movieId: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const userData = await this.getUser(uid);
    
    if (userData && !userData.myList.includes(movieId)) {
      await updateDoc(userRef, {
        myList: [...userData.myList, movieId]
      });
    }
  },

  async removeFromMyList(uid: string, movieId: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const userData = await this.getUser(uid);
    
    if (userData) {
      await updateDoc(userRef, {
        myList: userData.myList.filter(id => id !== movieId)
      });
    }
  }
};