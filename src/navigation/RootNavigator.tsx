import { useAuth } from "@/providers/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import { Text } from "@tamagui/core";
import { YStack } from "@tamagui/stacks";
import React from "react";
import { ActivityIndicator } from "react-native";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
        space="$4"
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text fontSize="$4" color="$color10" fontWeight="500">
          Loading...
        </Text>
      </YStack>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
