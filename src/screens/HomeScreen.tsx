import { useAuth } from "@/providers/AuthProvider";
import { AppStackParamList } from "@/types/auth";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  H1,
  Paragraph,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
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
          paddingHorizontal: insets.left + 24,
          paddingRight: insets.right + 24,
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <YStack space="$6" flex={1}>
          {/* Header */}
          <YStack alignItems="center" space="$4">
            <YStack
              width={80}
              height={80}
              backgroundColor="$blue9"
              borderRadius="$round"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={32} color="white">
                🌰
              </Text>
            </YStack>

            <YStack alignItems="center" space="$2">
              <H1 textAlign="center">Welcome to Acorn Pups!</H1>
              <Paragraph color="$color10" textAlign="center">
                You're successfully logged in
              </Paragraph>
            </YStack>
          </YStack>

          {/* User Info */}
          <Card
            backgroundColor="$gray1"
            borderColor="$gray5"
            borderWidth={1}
            borderRadius="$4"
            padding="$4"
          >
            <YStack space="$3">
              <Text fontSize="$5" fontWeight="600" color="$color12">
                Account Information
              </Text>

              <YStack space="$2">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$color10">Name:</Text>
                  <Text fontWeight="500">{user?.name || "N/A"}</Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$color10">Email:</Text>
                  <Text fontWeight="500">{user?.email || "N/A"}</Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$color10">User ID:</Text>
                  <Text fontWeight="500" fontSize="$3">
                    {user?.id || "N/A"}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Features */}
          <Card
            backgroundColor="$blue1"
            borderColor="$blue5"
            borderWidth={1}
            borderRadius="$4"
            padding="$4"
          >
            <YStack space="$3">
              <Text fontSize="$5" fontWeight="600" color="$blue12">
                What's Next?
              </Text>

              <YStack space="$2">
                <XStack alignItems="center" space="$3">
                  <Text fontSize="$4" color="$blue10">
                    🚀
                  </Text>
                  <Paragraph color="$blue11">Explore app features</Paragraph>
                </XStack>
                <XStack alignItems="center" space="$3">
                  <Text fontSize="$4" color="$blue10">
                    ⚙️
                  </Text>
                  <Paragraph color="$blue11">Customize your profile</Paragraph>
                </XStack>
                <XStack alignItems="center" space="$3">
                  <Text fontSize="$4" color="$blue10">
                    🔒
                  </Text>
                  <Paragraph color="$blue11">
                    Enable biometric authentication
                  </Paragraph>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Actions */}
          <YStack space="$3" marginTop="auto">
            <Button
              size="$4"
              variant="outlined"
              onPress={() => {
                // TODO: Add profile navigation
                console.log("Navigate to profile");
              }}
            >
              View Profile
            </Button>

            <Button size="$4" theme="red" onPress={handleSignOut}>
              Sign Out
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};
