import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import type { SignInInput, SignUpInput } from 'aws-amplify/auth';

export interface AuthUser {
  username: string;
  userId: string;
  signInDetails?: any;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser({
        username: currentUser.username,
        userId: currentUser.userId,
        signInDetails: currentUser.signInDetails,
      });
      setError(null);
    } catch (err) {
      // User is not authenticated
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const signInInput: SignInInput = {
        username,
        password,
      };
      const result = await signIn(signInInput);
      
      // If sign in requires additional steps (like MFA), handle them
      if (result.isSignedIn) {
        await checkAuth();
        return { success: true };
      } else {
        // Handle next step (e.g., MFA, new password required)
        return { 
          success: false, 
          nextStep: result.nextStep,
          message: 'Additional authentication steps required' 
        };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (username: string, password: string, email: string) => {
    try {
      setError(null);
      setLoading(true);
      const signUpInput: SignUpInput = {
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      };
      await signUp(signUpInput);
      return { success: true, message: 'Sign up successful. Please check your email for verification code.' };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (username: string, confirmationCode: string) => {
    try {
      setError(null);
      setLoading(true);
      await confirmSignUp({
        username,
        confirmationCode,
      });
      return { success: true, message: 'Email verified successfully. You can now sign in.' };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to confirm sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (username: string) => {
    try {
      setError(null);
      await resendSignUpCode({ username });
      return { success: true, message: 'Verification code resent to your email.' };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut();
      setUser(null);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign out';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    resendCode: handleResendCode,
    signOut: handleSignOut,
    checkAuth,
  };
}

