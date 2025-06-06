import React from 'react'
import { Button as TamaguiButton, ButtonProps } from '@tamagui/button'

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  buttonVariant?: 'primary' | 'secondary' | 'outline'
}

export const Button: React.FC<CustomButtonProps> = ({ 
  buttonVariant = 'primary', 
  children, 
  ...props 
}) => {
  const getVariantProps = () => {
    switch (buttonVariant) {
      case 'secondary':
        return {
          backgroundColor: '$gray5',
          color: '$gray12',
          borderColor: '$gray7',
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '$blue8',
          color: '$blue11',
        }
      default:
        return {
          backgroundColor: '$blue9',
          color: 'white',
        }
    }
  }

  return (
    <TamaguiButton
      size="$4"
      fontWeight="600"
      borderRadius="$4"
      pressStyle={{ scale: 0.97 }}
      hoverStyle={{ backgroundColor: buttonVariant === 'primary' ? '$blue10' : undefined }}
      {...getVariantProps()}
      {...props}
    >
      {children}
    </TamaguiButton>
  )
} 