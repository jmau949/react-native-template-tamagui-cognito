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
  const { signUp } = useAuth();
  const toast = useToastController();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await signUp(formData.email, formData.password, formData.name);

      toast.show("Success", {
        message: "Account created! Please check your email for verification.",
        type: "success",
      });

      navigation.navigate("ConfirmSignUp", {
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      toast.show("Sign Up Failed", {
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
                  borderColor={errors.name ? "$red8" : "$borderColor"}
                />
                {errors.name && (
                  <Text fontSize="$3" color="$red10">
                    {errors.name}
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
                  placeholder="Create a password (min 8 characters)"
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
                  disabled={isSubmitting}
                  opacity={isSubmitting ? 0.6 : 1}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
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

      {/* Toast Provider */}
      <Toast />
    </YStack>
  );
};
