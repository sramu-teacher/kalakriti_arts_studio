import { useState, useCallback } from "react";
import { requestInteractiveSignIn, getUserProfile, signOut } from "../utils/googleAuth.js";

export function useGoogleAuth() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);

  const signIn = useCallback(async () => {
    setSigningIn(true);
    setError(null);
    try {
      await requestInteractiveSignIn();
      const user = await getUserProfile();
      setProfile(user);
    } catch (err) {
      setError(err.message || "Couldn't sign in with Google — please try again.");
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOutUser = useCallback(() => {
    signOut();
    setProfile(null);
  }, []);

  return { profile, error, signingIn, signIn, signOut: signOutUser };
}
