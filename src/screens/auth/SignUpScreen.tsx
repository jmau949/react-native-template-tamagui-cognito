import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H2, Input, Paragraph, Text, XStack, YStack } from "tamagui";
import { APP_NAME } from "../../../template.config";

// Email validation pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await signUp(email, password, name);

      // Navigate to email verification screen
      navigation.navigate("EmailVerification", {
        email,
        password,
        context: "signup" as const,
      });
    } catch (error: any) {
      console.error("Sign up error:", error);

      // Handle specific Cognito errors
      let errorMessage = "Failed to create account. Please try again.";

      if (error.name === "UsernameExistsException") {
        errorMessage = "An account with this email already exists.";
        setErrors({ email: errorMessage });
        return;
      }

      if (error.name === "InvalidParameterException") {
        if (error.message?.includes("email")) {
          errorMessage = "Please enter a valid email address.";
          setErrors({ email: errorMessage });
          return;
        }
        if (error.message?.includes("password")) {
          errorMessage = "Password does not meet requirements.";
          setErrors({ password: errorMessage });
          return;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: insets.left + 24,
          paddingRight: insets.right + 24,
          paddingVertical: 20,
          paddingBottom: Platform.OS === "android" ? 60 : 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <YStack space="$3" width="100%" maxWidth={400} alignSelf="center">
          {/* Header */}
          <YStack alignItems="center" space="$1">
            <H2 textAlign="center">Create Account</H2>
            <Paragraph color="$color10" textAlign="center" fontSize="$3">
              Join the {APP_NAME} community
            </Paragraph>
          </YStack>

          {/* Form */}
          <YStack space="$3">
            {/* General Error */}
            {errors.general && (
              <YStack
                backgroundColor="$red2"
                borderColor="$red7"
                borderWidth={1}
                borderRadius="$3"
                padding="$3"
              >
                <Text color="$red11" fontSize="$3" textAlign="center">
                  {errors.general}
                </Text>
              </YStack>
            )}

            {/* Name Field */}
            <YStack space="$2">
              <Input
                placeholder="Full name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                borderColor={errors.name ? "$red7" : "$borderColor"}
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
              />
              {errors.name && (
                <Text color="$red11" fontSize="$2">
                  {errors.name}
                </Text>
              )}
            </YStack>

            {/* Email Field */}
            <YStack space="$2">
              <Input
                placeholder="Email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase());
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                borderColor={errors.email ? "$red7" : "$borderColor"}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
              {errors.email && (
                <Text color="$red11" fontSize="$2">
                  {errors.email}
                </Text>
              )}
            </YStack>

            {/* Password Field */}
            <YStack space="$2">
              <Input
                placeholder="Password (8+ characters)"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                borderColor={errors.password ? "$red7" : "$borderColor"}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="next"
              />
              {errors.password && (
                <Text color="$red11" fontSize="$2">
                  {errors.password}
                </Text>
              )}
            </YStack>

            {/* Confirm Password Field */}
            <YStack space="$2">
              <Input
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                borderColor={errors.confirmPassword ? "$red7" : "$borderColor"}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              {errors.confirmPassword && (
                <Text color="$red11" fontSize="$2">
                  {errors.confirmPassword}
                </Text>
              )}
            </YStack>

            {/* Submit Button */}
            <Button
              size="$4"
              theme="blue"
              onPress={handleSignUp}
              disabled={isLoading}
              opacity={isLoading ? 0.6 : 1}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <XStack justifyContent="center" alignItems="center" space="$2">
              <Text color="$color10" fontSize="$3">
                Already have an account?
              </Text>
              <Button
                variant="outlined"
                size="$2"
                onPress={() => navigation.navigate("Login")}
                chromeless
              >
                <Text color="$blue10" fontSize="$3">
                  Sign In
                </Text>
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};
