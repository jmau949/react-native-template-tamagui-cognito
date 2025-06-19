import { RootNavigator } from "@/navigation/RootNavigator";
import { AuthProvider } from "@/providers/AuthProvider";
import tamaguiConfig from "@/tamagui.config";
import { ToastProvider } from "@tamagui/toast";
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
        </ToastProvider>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
