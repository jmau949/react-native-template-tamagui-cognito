import { StatusBar } from "expo-status-bar";
import React from "react";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { AppTamaguiProvider } from "./src/providers/TamaguiProvider";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  return (
    <ErrorBoundary>
      <AppTamaguiProvider>
        <HomeScreen />
        <StatusBar style="auto" />
      </AppTamaguiProvider>
    </ErrorBoundary>
  );
}
