import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import tamaguiConfig from '../tamagui.config'

interface Props {
  children: React.ReactNode
}

export const AppTamaguiProvider: React.FC<Props> = ({ children }) => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      {children}
    </TamaguiProvider>
  )
} 