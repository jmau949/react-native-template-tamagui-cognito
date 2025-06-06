import React, { Component, ErrorInfo, ReactNode } from "react";
import { Text, View } from "react-native";
import { Button } from "./ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: "#f9fafb",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Oops! Something went wrong
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
              marginBottom: 24,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            We're sorry for the inconvenience. Please try again.
          </Text>

          {__DEV__ && this.state.error && (
            <Text
              style={{
                fontSize: 12,
                color: "#ef4444",
                marginBottom: 24,
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              {this.state.error.message}
            </Text>
          )}

          <Button buttonVariant="primary" onPress={this.handleReset}>
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}
