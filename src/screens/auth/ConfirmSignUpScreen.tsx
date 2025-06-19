import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Toast, useToastController } from "@tamagui/toast";
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

export const ConfirmSignUpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, password } = route.params;
  const { confirmSignUp, resendConfirmationCode, signIn } = useAuth();
  const toast = useToastController();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleConfirmSignUp = async () => {
    if (!code.trim()) {
      toast.show("Missing Code", {
        message: "Please enter the verification code",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Confirm sign up
      await confirmSignUp(email, code.trim());

      toast.show("Email Verified!", {
        message: "Your account has been verified. Signing you in...",
        type: "success",
      });

      // Step 2: Automatically sign in the user
      try {
        await signIn(email, password);

        // Success toast for sign in
        toast.show("Welcome!", {
          message: "You have been signed in successfully",
          type: "success",
        });

        // Navigation will be handled automatically by RootNavigator based on auth state
      } catch (signInError) {
        console.error("Auto sign-in failed:", signInError);

        // If auto sign-in fails, show error and navigate to login
        toast.show("Sign In Failed", {
          message:
            "Email verified but auto sign-in failed. Please sign in manually.",
          type: "error",
        });

        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Email confirmation failed:", error);
      toast.show("Verification Failed", {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      await resendConfirmationCode(email);
      toast.show("Code Sent", {
        message: "A new verification code has been sent to your email",
        type: "success",
      });
    } catch (error) {
      toast.show("Failed to Resend", {
        message: error instanceof Error ? error.message : "Please try again",
        type: "error",
      });
    } finally {
      setIsResending(false);
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
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textAlign="center"
                  fontSize="$5"
                  letterSpacing={4}
                  size="$5"
                  maxLength={6}
                />
              </YStack>

              {/* Verify Button */}
              <Form.Trigger asChild>
                <Button
                  size="$5"
                  theme="blue"
                  disabled={isSubmitting || code.length !== 6}
                  opacity={isSubmitting || code.length !== 6 ? 0.6 : 1}
                >
                  {isSubmitting ? "Verifying..." : "Verify Email"}
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
              disabled={isResending}
              opacity={isResending ? 0.6 : 1}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
          </YStack>

          {/* Back to Sign Up */}
          <XStack justifyContent="center" alignItems="center" space="$2">
            <Paragraph fontSize="$3">Wrong email?</Paragraph>
            <Button
              size="$3"
              variant="outlined"
              onPress={() => navigation.navigate("SignUp")}
              chromeless
            >
              Back to Sign Up
            </Button>
          </XStack>
        </YStack>
      </ScrollView>

      {/* Toast Provider */}
      <Toast />
    </YStack>
  );
};
