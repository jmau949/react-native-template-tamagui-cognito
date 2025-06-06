import React from 'react'
import { YStack, XStack } from '@tamagui/stacks'
import { ViewStyle } from 'react-native'

interface ContainerProps {
  children: React.ReactNode
  direction?: 'vertical' | 'horizontal'
  centered?: boolean
  withPadding?: boolean
  flex?: number
  backgroundColor?: string
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  direction = 'vertical',
  centered = false,
  withPadding = true,
  flex = 1,
  backgroundColor,
}) => {
  const Stack = direction === 'horizontal' ? XStack : YStack
  
  return (
    <Stack
      flex={flex}
      padding={withPadding ? '$4' : undefined}
      alignItems={centered ? 'center' : undefined}
      justifyContent={centered ? 'center' : undefined}
      backgroundColor={backgroundColor}
    >
      {children}
    </Stack>
  )
}

interface CardProps {
  children: React.ReactNode
  backgroundColor?: string
  style?: ViewStyle
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  backgroundColor = '$gray1',
  style
}) => {
  return (
    <YStack
      backgroundColor={backgroundColor}
      borderRadius="$4"
      borderWidth={1}
      borderColor="$gray5"
      padding="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={2}
      style={style}
    >
      {children}
    </YStack>
  )
} 