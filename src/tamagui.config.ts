import { config } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/core'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'

const headingFont = createInterFont()
const bodyFont = createInterFont()

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
} 