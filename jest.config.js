module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  // 这些库以 ESM 形式发布,需要交给 babel 转译(默认会跳过 node_modules)
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      '@react-native|react-native|' +
      '@react-navigation|' +
      'react-native-reanimated|react-native-worklets|' +
      'react-native-gesture-handler|react-native-screens|' +
      'react-native-safe-area-context|react-native-haptic-feedback|' +
      '@react-native-clipboard|@react-native-async-storage|' +
      'nanoid' +
      ')/)',
  ],
};
