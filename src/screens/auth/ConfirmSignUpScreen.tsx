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

type Props = NativeStackScreenProps<AuthStackParamList, "ConfirmSignUp">;

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

export const ConfirmSignUpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, password } = route.params;
  const { confirmSignUp, resendConfirmationCode, signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isResending: false,
    isSuccess: false,
    errors: {},
  });

  const handleConfirmSignUp = async () => {
    if (!code.trim()) {
      setFormState((prev) => ({
        ...prev,
        errors: { code: "Please enter the verification code" },
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
      // Step 1: Confirm sign up
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
          successMessage: "Welcome! You have been signed in successfully",
        });

        // Navigation will be handled automatically by RootNavigator based on auth state
      } catch (signInError) {
        console.error("Auto sign-in failed:", signInError);

        // If auto sign-in fails, show error and navigate to login
        setFormState({
          isSubmitting: false,
          isResending: false,
          isSuccess: false,
          errors: {
            general:
              "Email verified but auto sign-in failed. Please sign in manually.",
          },
        });

        // Navigate to login after a brief delay
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000);
      }
    } catch (error) {
      console.error("Email confirmation failed:", error);
      setFormState({
        isSubmitting: false,
        isResending: false,
        isSuccess: false,
        errors: {
          general:
            error instanceof Error
              ? error.message
              : "Verification failed. Please try again.",
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
      }, 3000);
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
            <H2 textAlign="center">Verify Your Email</H2>
            <Paragraph color="$color10" textAlign="center">
              We've sent a verification code to:
            </Paragraph>
            <Text fontWeight="600" fontSize="$4" color="$blue11">
              {email}
            </Text>
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
                ✅{" "}
                {formState.successMessage || "Welcome! Successfully signed in"}
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
              Please check your email and enter the 6-digit verification code
              below.
            </Paragraph>
          </Card>

          {/* Form */}
          <Form onSubmit={handleConfirmSignUp}>
            <YStack space="$4">
              <YStack space="$2">
                <Label fontWeight="600">Verification Code *</Label>
                <Input
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChangeText={(value: string) => {
                    setCode(value);
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
              <Form.Trigger asChild>
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
                >
                  {formState.isSubmitting
                    ? "Verifying..."
                    : formState.isSuccess
                    ? "Verified!"
                    : "Verify Email"}
                </Button>
              </Form.Trigger>
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

          {/* Back to Sign Up */}
          <XStack justifyContent="center">
            <Button
              size="$3"
              variant="outlined"
              onPress={() => navigation.navigate("SignUp")}
              chromeless
              disabled={formState.isSubmitting || formState.isSuccess}
            >
              ← Back to Sign Up
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};
