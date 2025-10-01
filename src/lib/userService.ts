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
  displayName: string | null;
  photoURL: string | null;
  myList: string[];
  createdAt: Date;
  lastLogin: Date;
}

export const userService = {
  async createUser(user: User): Promise<UserData> {
    const userRef = doc(db, 'users', user.uid);
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
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