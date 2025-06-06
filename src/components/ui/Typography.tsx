import React from 'react'
import { Text, TextProps } from 'react-native'

interface TypographyProps extends TextProps {
  children: React.ReactNode
}

export const Heading1: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text 
    style={[
      { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#111', 
        marginBottom: 16 
      }, 
      style
    ]} 
    {...props}
  >
    {children}
  </Text>
)

export const Heading2: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text 
    style={[
      { 
        fontSize: 24, 
        fontWeight: '600', 
        color: '#111', 
        marginBottom: 12 
      }, 
      style
    ]} 
    {...props}
  >
    {children}
  </Text>
)

export const Heading3: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text 
    style={[
      { 
        fontSize: 20, 
        fontWeight: '600', 
        color: '#111', 
        marginBottom: 8 
      }, 
      style
    ]} 
    {...props}
  >
    {children}
  </Text>
)

export const BodyText: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text 
    style={[
      { 
        fontSize: 16, 
        lineHeight: 24, 
        color: '#374151' 
      }, 
      style
    ]} 
    {...props}
  >
    {children}
  </Text>
)

export const Caption: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text 
    style={[
      { 
        fontSize: 12, 
        color: '#6B7280' 
      }, 
      style
    ]} 
    {...props}
  >
    {children}
  </Text>
) 