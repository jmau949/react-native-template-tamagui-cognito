module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['@tamagui/core', '@tamagui/config', '@tamagui/button', '@tamagui/input', '@tamagui/text', '@tamagui/stacks', '@tamagui/card'],
          config: './src/tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/hooks': './src/hooks',
            '@/utils': './src/utils',
            '@/types': './src/types',
            '@/constants': './src/constants',
            '@/services': './src/services',
            '@/navigation': './src/navigation',
          },
        },
      ],
    ],
  };
}; 