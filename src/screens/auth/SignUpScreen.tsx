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

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: FormErrors;
}

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    errors: {},
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formState.errors[field]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: undefined },
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setFormState((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      errors: {},
    });

    try {
      await signUp(formData.email, formData.password, formData.name);

      setFormState({
        isSubmitting: false,
        isSuccess: true,
        errors: {},
      });

      // Navigate to confirmation screen after showing success state briefly
      setTimeout(() => {
        navigation.navigate("ConfirmSignUp", {
          email: formData.email,
          password: formData.password,
        });
      }, 1500);
    } catch (error) {
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
            <H2 textAlign="center">Create Account</H2>
            <Paragraph color="$color10" textAlign="center">
              Join the Acorn Pups community
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
              <YStack space="$2" alignItems="center">
                <Text color="$green11" textAlign="center" fontWeight="600">
                  ✅ Account Created Successfully!
                </Text>
                <Text color="$green10" textAlign="center" fontSize="$3">
                  Please check your email for verification instructions
                </Text>
              </YStack>
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
          <Form onSubmit={handleSignUp}>
            <YStack space="$4">
              <YStack space="$2">
                <Label fontWeight="600">Full Name *</Label>
                <Input
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(value: string) =>
                    updateFormData("name", value)
                  }
                  autoCapitalize="words"
                  size="$4"
                  borderColor={formState.errors.name ? "$red8" : "$borderColor"}
                  disabled={formState.isSubmitting || formState.isSuccess}
                />
                {formState.errors.name && (
                  <Text fontSize="$3" color="$red10">
                    {formState.errors.name}
                  </Text>
                )}
              </YStack>

              <YStack space="$2">
                <Label fontWeight="600">Email *</Label>
                <Input
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value: string) =>
                    updateFormData("email", value)
                  }
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
                  placeholder="Create a password (min 8 characters)"
                  value={formData.password}
                  onChangeText={(value: string) =>
                    updateFormData("password", value)
                  }
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

              <YStack space="$2">
                <Label fontWeight="600">Confirm Password *</Label>
                <Input
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value: string) =>
                    updateFormData("confirmPassword", value)
                  }
                  secureTextEntry
                  size="$4"
                  borderColor={
                    formState.errors.confirmPassword ? "$red8" : "$borderColor"
                  }
                  disabled={formState.isSubmitting || formState.isSuccess}
                />
                {formState.errors.confirmPassword && (
                  <Text fontSize="$3" color="$red10">
                    {formState.errors.confirmPassword}
                  </Text>
                )}
              </YStack>
            </YStack>

            {/* Create Account Button */}
            <YStack marginTop="$4">
              <Button
                size="$5"
                theme="blue"
                disabled={formState.isSubmitting || formState.isSuccess}
                opacity={
                  formState.isSubmitting || formState.isSuccess ? 0.6 : 1
                }
                onPress={handleSignUp}
              >
                {formState.isSubmitting
                  ? "Creating Account..."
                  : formState.isSuccess
                  ? "Account Created!"
                  : "Create Account"}
              </Button>
            </YStack>
          </Form>

          {/* Sign In Link */}
          <XStack justifyContent="center" alignItems="center" space="$2">
            <Paragraph>Already have an account?</Paragraph>
            <Button
              size="$3"
              variant="outlined"
              onPress={() => navigation.navigate("Login")}
              chromeless
              disabled={formState.isSubmitting || formState.isSuccess}
            >
              Sign In
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};
