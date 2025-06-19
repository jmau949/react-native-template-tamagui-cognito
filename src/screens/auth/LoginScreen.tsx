import { useAuth } from "@/providers/AuthProvider";
import type { AuthStackParamList } from "@/types/auth";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Toast, useToastController } from "@tamagui/toast";
import React, { useState } from "react";
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

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn, isLoading } = useAuth();
  const toast = useToastController();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.show("Error", {
        message: "Please enter both email and password",
        type: "error",
      });
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      toast.show("Login Failed", {
        message: error instanceof Error ? error.message : "Please try again",
        type: "error",
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
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack space="$6" width="100%" maxWidth={400} alignSelf="center">
          {/* Header */}
          <YStack alignItems="center" space="$2">
            <H2 textAlign="center">Welcome Back</H2>
            <Paragraph color="$color10" textAlign="center">
              Sign in to your account
            </Paragraph>
          </YStack>

          {/* Demo Credentials Info */}
          <Card
            backgroundColor="$blue1"
            borderColor="$blue6"
            borderWidth={1}
            borderRadius="$3"
            padding="$3"
          >
            <Text
              fontSize="$3"
              color="$blue11"
              textAlign="center"
              fontWeight="500"
            >
              Demo: demo@acornpups.com / password123
            </Text>
          </Card>

          {/* Form */}
          <Form onSubmit={handleSignIn}>
            <YStack space="$4">
              <YStack space="$2">
                <Label htmlFor="email" fontWeight="600">
                  Email *
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  size="$4"
                />
              </YStack>

              <YStack space="$2">
                <Label htmlFor="password" fontWeight="600">
                  Password *
                </Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  size="$4"
                />
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
              <Form.Trigger asChild>
                <Button
                  size="$5"
                  theme="blue"
                  disabled={isLoading}
                  opacity={isLoading ? 0.6 : 1}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </Form.Trigger>
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
