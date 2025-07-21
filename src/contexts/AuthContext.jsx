import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth } from "../services/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Google sign-in example
  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  // Placeholder for email/password sign-in
  // const signInWithEmail = async (email, password) => {
  //   await signInWithEmailAndPassword(auth, email, password);
  // };

  const signOutUser = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    // signInWithEmail, // Uncomment if you implement
    signOut: signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };