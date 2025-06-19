import {
  ConfirmResetPasswordData,
  LoginCredentials,
  ResetPasswordData,
  SignUpCredentials,
  User,
} from "@/types/auth";
import * as SecureStore from "expo-secure-store";

class AuthService {
  private static instance: AuthService;
  private readonly TOKEN_KEY = "acorn_pups_auth_token";
  private readonly USER_KEY = "acorn_pups_user_data";

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Sign up a new user (Mock implementation - replace with AWS Cognito)
   */
  async signUp(
    credentials: SignUpCredentials
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Mock implementation - replace with actual AWS Cognito signUp
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name || "",
        emailVerified: false,
        phoneNumber: credentials.phoneNumber || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In real implementation, this would call AWS Cognito
      await this.delay(1000); // Simulate network delay

      return {
        success: true,
        message: "Verification code sent to your email",
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Confirm sign up with verification code (Mock implementation)
   */
  async confirmSignUp(
    email: string,
    code: string
  ): Promise<{ success: boolean }> {
    try {
      await this.delay(1000);

      // Mock verification - in real app, validate with AWS Cognito
      if (code === "123456") {
        return { success: true };
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in user (Mock implementation)
   */
  async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      await this.delay(1000);

      // Mock authentication - replace with AWS Cognito
      if (
        credentials.email === "demo@acornpups.com" &&
        credentials.password === "password123"
      ) {
        const user: User = {
          id: "1",
          email: credentials.email,
          name: "Demo User",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await this.storeAuthData(user);
        return user;
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await this.clearStoredData();
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(this.USER_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      const token = await SecureStore.getItemAsync(this.TOKEN_KEY);
      return !!(user && token);
    } catch (error) {
      return false;
    }
  }

  /**
   * Request password reset (Mock implementation)
   */
  async forgotPassword(
    data: ResetPasswordData
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.delay(1000);

      // Mock implementation
      return {
        success: true,
        message: "Password reset code sent to your email",
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Confirm password reset with code (Mock implementation)
   */
  async confirmForgotPassword(
    data: ConfirmResetPasswordData
  ): Promise<{ success: boolean }> {
    try {
      await this.delay(1000);

      // Mock implementation
      if (data.code === "123456") {
        return { success: true };
      } else {
        throw new Error("Invalid reset code");
      }
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Change password for authenticated user (Mock implementation)
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    try {
      await this.delay(1000);

      // Mock implementation
      return { success: true };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Store user authentication data securely
   */
  private async storeAuthData(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
      await SecureStore.setItemAsync(
        this.TOKEN_KEY,
        "mock_jwt_token_" + Date.now()
      );
    } catch (error) {
      throw new Error("Failed to store authentication data");
    }
  }

  /**
   * Clear all stored authentication data
   */
  private async clearStoredData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.USER_KEY);
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
    } catch (error) {
      // Ignore errors when clearing data
    }
  }

  /**
   * Simulate network delay for mock implementation
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handle and format authentication errors
   */
  private handleAuthError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("Authentication failed");
  }
}

export const authService = AuthService.getInstance();
