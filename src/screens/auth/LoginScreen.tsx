import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Toast, useToastController } from "@tamagui/toast";
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

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const toast = useToastController();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await signIn(email, password);

      toast.show("Welcome back!", {
        title: "Welcome back!",
        message: "You have been signed in successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast.show("Sign In Failed", {
        title: "Sign In Failed",
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

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
                  borderColor={errors.email ? "$red8" : "$borderColor"}
                />
                {errors.email && (
                  <Text fontSize="$3" color="$red10">
                    {errors.email}
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
                  borderColor={errors.password ? "$red8" : "$borderColor"}
                />
                {errors.password && (
                  <Text fontSize="$3" color="$red10">
                    {errors.password}
                  </Text>
                )}
              </YStack>

              <XStack justifyContent="flex-end">
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={() => navigation.navigate("ForgotPassword")}
                  chromeless
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
                disabled={isSubmitting}
                opacity={isSubmitting ? 0.6 : 1}
                onPress={handleSignIn}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
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
            >
              Sign Up
            </Button>
          </XStack>
        </YStack>
      </ScrollView>

      {/* Toast Provider */}
      <Toast />
    </YStack>
  );
};
