import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  // Update token whenever user changes
  useEffect(() => {
    const updateToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
        } catch (error) {
          console.error('Error getting token:', error);
          setAuthToken(null);
        }
      } else {
        setAuthToken(null);
      }
    };

    updateToken();

    // Optional: Set up token refresh interval
    const interval = setInterval(() => {
      if (user) {
        updateToken();
      }
    }, 55 * 60 * 1000); // Refresh every 55 minutes (tokens expire in 60 minutes)

    return () => clearInterval(interval);
  }, [user]);


  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };


  const uploadAvatar = async (file) => {
    if (!user) return null;
    const storageRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const value = {
    user,
    authToken,
    login,
    register,
    logout,
    loginWithGoogle,
    uploadAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};