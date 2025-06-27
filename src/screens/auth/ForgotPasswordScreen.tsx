import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
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

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { forgotPassword, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await forgotPassword(email);
      navigation.navigate("ConfirmResetPassword", { email });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to send reset email"
      );
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
            <H2 textAlign="center">Reset Password!!</H2>
            <Paragraph color="$color10" textAlign="center">
              Enter your email address and we'll send you a link to reset your
              password.
            </Paragraph>
          </YStack>

          {/* Form */}
          <Form onSubmit={handleResetPassword}>
            <YStack space="$4">
              <YStack space="$2">
                <Label fontWeight="600">Email Address *</Label>
                <Input
                  placeholder="Enter your email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  size="$4"
                  borderColor={error ? "$red8" : "$borderColor"}
                />
                {error && (
                  <Text fontSize="$3" color="$red10">
                    {error}
                  </Text>
                )}
              </YStack>
            </YStack>

            {/* Send Reset Email Button */}
            <YStack marginTop="$4">
              <Form.Trigger asChild>
                <Button
                  size="$5"
                  theme="blue"
                  disabled={isLoading}
                  opacity={isLoading ? 0.6 : 1}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Form.Trigger>
            </YStack>
          </Form>

          {/* Back to Login Link */}
          <XStack justifyContent="center" alignItems="center" space="$2">
            <Paragraph>Remember your password?</Paragraph>
            <Button
              size="$3"
              variant="outlined"
              onPress={() => navigation.navigate("Login")}
              chromeless
            >
              Back to Login
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};
