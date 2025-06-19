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
}

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUp(formData.email, formData.password, formData.name);
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
              <H2 textAlign="center">Create Account</H2>
              <Paragraph color="$color10" textAlign="center">
                Join the Acorn Pups community
              </Paragraph>
            </YStack>

            {/* Form */}
            <Form onSubmit={handleSignUp}>
              <YStack space="$4">
                <YStack space="$2">
                  <Label htmlFor="name" fontWeight="600">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(value: string) =>
                      updateFormData("name", value)
                    }
                    autoCapitalize="words"
                    size="$4"
                    borderColor={errors.name ? "$red8" : "$borderColor"}
                  />
                  {errors.name && (
                    <Text fontSize="$3" color="$red10">
                      {errors.name}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label htmlFor="email" fontWeight="600">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(value: string) =>
                      updateFormData("email", value)
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    size="$4"
                    borderColor={errors.email ? "$red8" : "$borderColor"}
                  />
                  {errors.email && (
                    <Text fontSize="$3" color="$red10">
                      {errors.email}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label htmlFor="password" fontWeight="600">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChangeText={(value: string) =>
                      updateFormData("password", value)
                    }
                    secureTextEntry
                    size="$4"
                    borderColor={errors.password ? "$red8" : "$borderColor"}
                  />
                  {errors.password && (
                    <Text fontSize="$3" color="$red10">
                      {errors.password}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label htmlFor="confirmPassword" fontWeight="600">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(value: string) =>
                      updateFormData("confirmPassword", value)
                    }
                    secureTextEntry
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

              {/* Create Account Button */}
              <YStack marginTop="$4">
                <Form.Trigger asChild>
                  <Button
                    size="$5"
                    theme="blue"
                    disabled={isLoading}
                    opacity={isLoading ? 0.6 : 1}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form.Trigger>
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
              >
                Sign In
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </YStack>
  );
};
