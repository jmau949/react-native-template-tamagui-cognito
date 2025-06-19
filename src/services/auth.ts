import { configureAmplify } from "@/config/aws-config";
import {
  ConfirmResetPasswordData,
  LoginCredentials,
  ResetPasswordData,
  SignUpCredentials,
  User,
} from "@/types/auth";
import {
  AuthUser,
  confirmResetPassword,
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updatePassword,
} from "aws-amplify/auth";
import * as SecureStore from "expo-secure-store";

// Initialize Amplify
configureAmplify();

/**
 * Simple authentication utilities - lets AWS Amplify handle token management
 */
export const authService = {
  /**
   * Convert Cognito user to our User type
   */
  cognitoUserToUser(cognitoUser: AuthUser): User {
    return {
      id: cognitoUser.userId,
      email: cognitoUser.signInDetails?.loginId || "",
      name: cognitoUser.username || "",
      emailVerified: true, // Cognito handles email verification
      phoneNumber: "", // Can be extracted from attributes if needed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Check if user is authenticated - Amplify handles token refresh automatically
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await fetchAuthSession();
      return !!session.tokens?.accessToken;
    } catch {
      return false;
    }
  },

  /**
   * Get current user if authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const cognitoUser = await getCurrentUser();
      return this.cognitoUserToUser(cognitoUser);
    } catch {
      return null;
    }
  },

  /**
   * Sign up a new user
   */
  async signUp(
    credentials: SignUpCredentials
  ): Promise<{ success: boolean; message: string }> {
    try {
      await signUp({
        username: credentials.email,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
            ...(credentials.name && { name: credentials.name }),
            ...(credentials.phoneNumber && {
              phone_number: credentials.phoneNumber,
            }),
          },
        },
      });

      return {
        success: true,
        message: "Verification code sent to your email",
      };
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Confirm sign up with verification code
   */
  async confirmSignUp(
    email: string,
    code: string
  ): Promise<{ success: boolean }> {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return { success: true };
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Resend confirmation code
   */
  async resendConfirmationCode(email: string): Promise<{ success: boolean }> {
    try {
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Sign in user
   */
  async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      const result = await signIn({
        username: credentials.email,
        password: credentials.password,
      });

      if (!result.isSignedIn) {
        throw new Error("Sign in was not completed");
      }

      const cognitoUser = await getCurrentUser();
      return this.cognitoUserToUser(cognitoUser);
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut();
      // Clear any cached user data
      await SecureStore.deleteItemAsync("cached_user_data").catch(() => {});
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(
    data: ResetPasswordData
  ): Promise<{ success: boolean; message: string }> {
    try {
      await resetPassword({ username: data.email });
      return {
        success: true,
        message: "Password reset code sent to your email",
      };
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Confirm password reset with code
   */
  async confirmForgotPassword(
    data: ConfirmResetPasswordData
  ): Promise<{ success: boolean }> {
    try {
      await confirmResetPassword({
        username: data.email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });
      return { success: true };
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    try {
      await updatePassword({ oldPassword, newPassword });
      return { success: true };
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Get current session - Amplify handles refresh automatically
   */
  async getSession() {
    try {
      return await fetchAuthSession();
    } catch (error) {
      throw this.formatError(error);
    }
  },

  /**
   * Format error messages for user-friendly display
   */
  formatError(error: any): Error {
    const errorCode = error.code || error.name;

    const errorMessages: Record<string, string> = {
      UserNotFoundException:
        "User not found. Please check your email and try again.",
      NotAuthorizedException: "Incorrect email or password.",
      UserNotConfirmedException: "Please verify your email before signing in.",
      CodeMismatchException: "Invalid verification code. Please try again.",
      ExpiredCodeException:
        "Verification code has expired. Please request a new one.",
      LimitExceededException: "Too many attempts. Please try again later.",
      UsernameExistsException: "An account with this email already exists.",
      InvalidPasswordException: "Password does not meet requirements.",
      TooManyRequestsException:
        "Too many requests. Please wait before trying again.",
      NetworkError:
        "Network error. Please check your connection and try again.",
    };

    const message =
      errorMessages[errorCode] ||
      error.message ||
      "An unexpected error occurred. Please try again.";
    return new Error(message);
  },
};
