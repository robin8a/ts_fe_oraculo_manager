import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

export interface AuthUser {
  username: string;
  userId?: string;
  attributes?: any;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes
    const unsubscribe = Auth.currentAuthenticatedUser()
      .then(() => checkAuth())
      .catch(() => {
        setUser(null);
        setLoading(false);
      });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser({
        username: currentUser.username,
        userId: currentUser.attributes?.sub,
        attributes: currentUser.attributes,
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
      const user = await Auth.signIn(username, password);
      
      // Check if user needs to change password or complete MFA
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        return { 
          success: false, 
          challengeName: user.challengeName,
          message: 'New password required. Please set a new password.' 
        };
      }
      
      if (user.challengeName === 'SOFTWARE_TOKEN_MFA' || user.challengeName === 'SMS_MFA') {
        return { 
          success: false, 
          challengeName: user.challengeName,
          message: 'MFA code required.' 
        };
      }
      
      await checkAuth();
      return { success: true };
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
      const result = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      return { 
        success: true, 
        message: 'Sign up successful. Please check your email for verification code.',
        userSub: result.userSub,
      };
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
      await Auth.confirmSignUp(username, confirmationCode);
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
      await Auth.resendSignUp(username);
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
      await Auth.signOut();
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
