import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Form,
  H2,
  Input,
  Label,
  Paragraph,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: FormErrors;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn, autoSendVerificationCode } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    errors: {},
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setFormState((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      errors: {},
    });

    try {
      await signIn(email, password);

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        errors: {},
      });

      // The navigation will be handled automatically by RootNavigator based on auth state
    } catch (error: unknown) {
      console.error("Login failed:", error);

      // Check if user needs email verification
      if ((error as any)?.code === "UserNotConfirmedException") {
        setFormState({
          isSubmitting: true,
          isSuccess: false,
          errors: {},
        });

        try {
          // Auto-send verification code in background
          await autoSendVerificationCode(email);

          // Navigate to verification screen with auto-sent flag
          setTimeout(() => {
            navigation.navigate("EmailVerification", {
              email,
              password,
              context: "login",
              autoSent: true,
            });
          }, 500);

          return;
        } catch (sendError) {
          console.error("Failed to auto-send verification code:", sendError);
          // Fall through to normal error handling
        }
      }

      setFormState({
        isSubmitting: false,
        isSuccess: false,
        errors: {
          general:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again.",
        },
      });
    }
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (formState.errors[field]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: undefined },
      }));
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
        flex={1}
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
        <YStack space="$6" width="100%" maxWidth={400} alignSelf="center">
          {/* Header */}
          <YStack alignItems="center" space="$2">
            <H2 textAlign="center">Welcome Back</H2>
            <Paragraph color="$color10" textAlign="center">
              Sign in to your account
            </Paragraph>
          </YStack>

          {/* Success Message */}
          {formState.isSuccess && (
            <Card
              backgroundColor="$green2"
              borderColor="$green8"
              borderWidth={1}
              borderRadius="$4"
              padding="$4"
            >
              <Text color="$green11" textAlign="center" fontWeight="600">
                ✅ Welcome back! Signing you in...
              </Text>
            </Card>
          )}

          {/* General Error Message */}
          {formState.errors.general && (
            <Card
              backgroundColor="$red2"
              borderColor="$red8"
              borderWidth={1}
              borderRadius="$4"
              padding="$4"
            >
              <Text color="$red11" textAlign="center">
                {formState.errors.general}
              </Text>
            </Card>
          )}

          {/* Form */}
          <Form onSubmit={handleSignIn}>
            <YStack space="$4">
              <YStack space="$2">
                <Label fontWeight="600">Email *</Label>
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(value: string) => {
                    setEmail(value);
                    clearFieldError("email");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  size="$4"
                  borderColor={
                    formState.errors.email ? "$red8" : "$borderColor"
                  }
                  disabled={formState.isSubmitting || formState.isSuccess}
                />
                {formState.errors.email && (
                  <Text fontSize="$3" color="$red10">
                    {formState.errors.email}
                  </Text>
                )}
              </YStack>

              <YStack space="$2">
                <Label fontWeight="600">Password *</Label>
                <Input
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(value: string) => {
                    setPassword(value);
                    clearFieldError("password");
                  }}
                  secureTextEntry
                  size="$4"
                  borderColor={
                    formState.errors.password ? "$red8" : "$borderColor"
                  }
                  disabled={formState.isSubmitting || formState.isSuccess}
                />
                {formState.errors.password && (
                  <Text fontSize="$3" color="$red10">
                    {formState.errors.password}
                  </Text>
                )}
              </YStack>

              <XStack justifyContent="flex-end">
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={() => navigation.navigate("ForgotPassword")}
                  chromeless
                  disabled={formState.isSubmitting || formState.isSuccess}
                >
                  Forgot Password?
                </Button>
              </XStack>
            </YStack>

            {/* Sign In Button */}
            <YStack marginTop="$4">
              <Button
                size="$5"
                theme="blue"
                disabled={formState.isSubmitting || formState.isSuccess}
                opacity={
                  formState.isSubmitting || formState.isSuccess ? 0.6 : 1
                }
                onPress={handleSignIn}
              >
                {formState.isSubmitting
                  ? "Signing In..."
                  : formState.isSuccess
                  ? "Success!"
                  : "Sign In"}
              </Button>
            </YStack>
          </Form>

          {/* Sign Up Link */}
          <XStack justifyContent="center" alignItems="center" space="$2">
            <Paragraph>Don't have an account?</Paragraph>
            <Button
              size="$3"
              variant="outlined"
              onPress={() => navigation.navigate("SignUp")}
              chromeless
              disabled={formState.isSubmitting || formState.isSuccess}
            >
              Sign Up
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};
