import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
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

type Props = NativeStackScreenProps<AuthStackParamList, "ConfirmResetPassword">;

interface FormData {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const ConfirmResetPasswordScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { confirmResetPassword, isLoading } = useAuth();
  const { email } = route.params;
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<FormData>({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Verification code is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmReset = async () => {
    if (!validateForm()) return;

    try {
      await confirmResetPassword(email, formData.code, formData.newPassword);
      navigation.navigate("Login");
    } catch (error) {
      // Error handling is done in AuthProvider
    }
  };

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top}
      paddingBottom={insets.bottom}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        >
          <YStack space="$6" width="100%" maxWidth={400} alignSelf="center">
            {/* Header */}
            <YStack alignItems="center" space="$2">
              <H2 textAlign="center">Set New Password</H2>
              <Paragraph color="$color10" textAlign="center">
                Enter the verification code sent to {email} and your new
                password.
              </Paragraph>
            </YStack>

            {/* Form */}
            <Form onSubmit={handleConfirmReset}>
              <YStack space="$4">
                <YStack space="$2">
                  <Label fontWeight="600">Verification Code *</Label>
                  <Input
                    placeholder="Enter verification code"
                    value={formData.code}
                    onChangeText={(value: string) =>
                      updateFormData("code", value)
                    }
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                    size="$4"
                    borderColor={errors.code ? "$red8" : "$borderColor"}
                  />
                  {errors.code && (
                    <Text fontSize="$3" color="$red10">
                      {errors.code}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label fontWeight="600">New Password *</Label>
                  <Input
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChangeText={(value: string) =>
                      updateFormData("newPassword", value)
                    }
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
                    size="$4"
                    borderColor={errors.newPassword ? "$red8" : "$borderColor"}
                  />
                  {errors.newPassword && (
                    <Text fontSize="$3" color="$red10">
                      {errors.newPassword}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label fontWeight="600">Confirm New Password *</Label>
                  <Input
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChangeText={(value: string) =>
                      updateFormData("confirmPassword", value)
                    }
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
                    size="$4"
                    borderColor={
                      errors.confirmPassword ? "$red8" : "$borderColor"
                    }
                  />
                  {errors.confirmPassword && (
                    <Text fontSize="$3" color="$red10">
                      {errors.confirmPassword}
                    </Text>
                  )}
                </YStack>
              </YStack>

              {/* Reset Password Button */}
              <YStack marginTop="$4">
                <Form.Trigger asChild>
                  <Button
                    size="$5"
                    theme="blue"
                    disabled={isLoading}
                    opacity={isLoading ? 0.6 : 1}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
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
      </KeyboardAvoidingView>
    </YStack>
  );
};
