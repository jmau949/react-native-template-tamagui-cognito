import {
  ConfirmResetPasswordScreen,
  ForgotPasswordScreen,
  LoginScreen,
  SignUpScreen,
  WelcomeScreen,
} from "@/screens/auth";
import type { AuthStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="ConfirmResetPassword"
        component={ConfirmResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};
