import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
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

type Props = NativeStackScreenProps<AuthStackParamList, "EmailVerification">;

interface FormState {
  isSubmitting: boolean;
  isResending: boolean;
  isSuccess: boolean;
  errors: {
    code?: string;
    general?: string;
  };
  successMessage?: string;
}

export const EmailVerificationScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { email, password, context, autoSent } = route.params;
  const { confirmSignUp, resendConfirmationCode, signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");

  // Context-aware messaging
  const isSignupFlow = context === "signup";
  const title = isSignupFlow
    ? "Verify Your Email"
    : "Email Verification Required";
  const subtitle = isSignupFlow
    ? "We sent a verification code to complete your account setup"
    : "Please verify your email address to continue signing in";
  const autoSentMessage = autoSent
    ? `We just sent a verification code to ${email}`
    : undefined;
  const buttonText = isSignupFlow
    ? "Verify & Complete Setup"
    : "Verify & Sign In";
  const backText = isSignupFlow ? "← Back to Sign Up" : "← Back to Sign In";
  const backAction = () =>
    navigation.navigate(isSignupFlow ? "SignUp" : "Login");

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isResending: false,
    isSuccess: false,
    errors: {},
    successMessage: autoSentMessage,
  });

  // Clear the auto-sent message after a few seconds
  useEffect(() => {
    if (autoSent && formState.successMessage) {
      const timer = setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          successMessage: undefined,
        }));
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [autoSent, formState.successMessage]);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setFormState((prev) => ({
        ...prev,
        errors: { code: "Please enter the 6-digit verification code" },
      }));
      return;
    }

    if (code.length !== 6) {
      setFormState((prev) => ({
        ...prev,
        errors: { code: "Verification code must be 6 digits" },
      }));
      return;
    }

    setFormState({
      isSubmitting: true,
      isResending: false,
      isSuccess: false,
      errors: {},
    });

    try {
      // Step 1: Confirm the user's email
      await confirmSignUp(email, code.trim());

      setFormState((prev) => ({
        ...prev,
        successMessage: "Email verified! Signing you in...",
      }));

      // Step 2: Automatically sign in the user
      try {
        await signIn(email, password);

        setFormState({
          isSubmitting: false,
          isResending: false,
          isSuccess: true,
          errors: {},
          successMessage: isSignupFlow
            ? "Welcome! Your account is ready"
            : "Welcome back! You're now signed in",
        });

        // Navigation will be handled automatically by RootNavigator based on auth state
      } catch (signInError) {
        console.error("Auto sign-in failed after verification:", signInError);

        // If auto sign-in fails, show success but redirect to login
        setFormState({
          isSubmitting: false,
          isResending: false,
          isSuccess: false,
          errors: {
            general: "Email verified successfully! Please sign in to continue.",
          },
        });

        // Navigate to login after a brief delay
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      }
    } catch (error) {
      console.error("Email verification failed:", error);
      setFormState({
        isSubmitting: false,
        isResending: false,
        isSuccess: false,
        errors: {
          general:
            error instanceof Error
              ? error.message
              : "Verification failed. Please check your code and try again.",
        },
      });
    }
  };

  const handleResendCode = async () => {
    setFormState((prev) => ({
      ...prev,
      isResending: true,
      errors: {},
    }));

    try {
      await resendConfirmationCode(email);
      setFormState((prev) => ({
        ...prev,
        isResending: false,
        successMessage: "New verification code sent to your email",
      }));

      // Clear success message after a few seconds
      setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          successMessage: undefined,
        }));
      }, 4000);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isResending: false,
        errors: {
          general:
            error instanceof Error
              ? error.message
              : "Failed to resend code. Please try again.",
        },
      }));
    }
  };

  const clearCodeError = () => {
    if (formState.errors.code) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, code: undefined },
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
          <YStack alignItems="center" space="$3">
            <H2 textAlign="center">{title}</H2>
            <YStack alignItems="center" space="$2">
              <Paragraph color="$color10" textAlign="center">
                {subtitle}
              </Paragraph>
              <Text fontWeight="600" fontSize="$4" color="$blue11">
                {email}
              </Text>
            </YStack>
          </YStack>

          {/* Success Message */}
          {(formState.isSuccess || formState.successMessage) && (
            <Card
              backgroundColor="$green2"
              borderColor="$green8"
              borderWidth={1}
              borderRadius="$4"
              padding="$4"
            >
              <Text color="$green11" textAlign="center" fontWeight="600">
                ✅ {formState.successMessage || "Successfully verified!"}
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

          {/* Info Card */}
          <Card
            backgroundColor="$blue1"
            borderColor="$blue6"
            borderWidth={1}
            borderRadius="$4"
            padding="$4"
          >
            <Paragraph fontSize="$3" color="$blue11" textAlign="center">
              Check your email and enter the 6-digit verification code below
            </Paragraph>
          </Card>

          {/* Form */}
          <Form onSubmit={handleVerifyCode}>
            <YStack space="$4">
              <YStack space="$2">
                <Label fontWeight="600">Verification Code *</Label>
                <Input
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChangeText={(value: string) => {
                    // Only allow numbers and limit to 6 digits
                    const numericValue = value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 6);
                    setCode(numericValue);
                    clearCodeError();
                  }}
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textAlign="center"
                  fontSize="$5"
                  letterSpacing={4}
                  size="$5"
                  maxLength={6}
                  borderColor={formState.errors.code ? "$red8" : "$borderColor"}
                  disabled={formState.isSubmitting || formState.isSuccess}
                />
                {formState.errors.code && (
                  <Text fontSize="$3" color="$red10">
                    {formState.errors.code}
                  </Text>
                )}
              </YStack>

              {/* Verify Button */}
              <Button
                size="$5"
                theme="blue"
                disabled={
                  formState.isSubmitting ||
                  code.length !== 6 ||
                  formState.isSuccess
                }
                opacity={
                  formState.isSubmitting ||
                  code.length !== 6 ||
                  formState.isSuccess
                    ? 0.6
                    : 1
                }
                onPress={handleVerifyCode}
              >
                {formState.isSubmitting
                  ? "Verifying..."
                  : formState.isSuccess
                  ? "Verified!"
                  : buttonText}
              </Button>
            </YStack>
          </Form>

          {/* Resend Code */}
          <YStack space="$3" alignItems="center">
            <Paragraph fontSize="$3" color="$color10" textAlign="center">
              Didn't receive the code?
            </Paragraph>
            <Button
              size="$4"
              variant="outlined"
              theme="blue"
              onPress={handleResendCode}
              disabled={
                formState.isResending ||
                formState.isSubmitting ||
                formState.isSuccess
              }
              opacity={
                formState.isResending ||
                formState.isSubmitting ||
                formState.isSuccess
                  ? 0.6
                  : 1
              }
            >
              {formState.isResending ? "Sending..." : "Resend Code"}
            </Button>
          </YStack>

          {/* Back Button */}
          <XStack justifyContent="center">
            <Button
              size="$3"
              variant="outlined"
              onPress={backAction}
              chromeless
              disabled={formState.isSubmitting || formState.isSuccess}
            >
              {backText}
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};
