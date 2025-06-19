import { RootNavigator } from "@/navigation/RootNavigator";
import { AuthProvider } from "@/providers/AuthProvider";
import tamaguiConfig from "@/tamagui.config";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <SafeAreaProvider>
        <ToastProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
          <ToastViewport
            name="main"
            top="$10"
            left="$4"
            right="$4"
            zIndex={100000}
          />
        </ToastProvider>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
