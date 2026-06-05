/* eslint-disable no-undef */
// Jest 全局 mock:把依赖原生模块的库替换为测试可用的实现。

// Reanimated v4 自带的 mock 会引入原生 worklets 而崩溃,这里用轻量手写 mock:
// 动画一律"直接到位",组件渲染为普通 View/Text。
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  const Easing = new Proxy({}, { get: () => () => 0 });
  return {
    __esModule: true,
    default: { View, Text, createAnimatedComponent: c => c, call: () => {} },
    View,
    Text,
    useSharedValue: init => ({ value: init }),
    useAnimatedStyle: () => ({}),
    useDerivedValue: () => ({ value: undefined }),
    withTiming: v => v,
    withSpring: v => v,
    withDelay: (_d, v) => v,
    withSequence: (...a) => a[a.length - 1],
    withRepeat: v => v,
    cancelAnimation: () => {},
    interpolate: () => 0,
    Easing,
    runOnJS: fn => fn,
    runOnUI: fn => fn,
  };
});

// Gesture Handler:官方 jest setup
require('react-native-gesture-handler/jestSetup');

// 触感反馈:无原生实现,直接 stub
jest.mock('react-native-haptic-feedback', () => ({
  __esModule: true,
  default: { trigger: jest.fn() },
  trigger: jest.fn(),
}));

// AsyncStorage:简易内存 mock
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(key => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
    },
  };
});

// 剪贴板:stub
jest.mock('@react-native-clipboard/clipboard', () => ({
  __esModule: true,
  default: { setString: jest.fn(), getString: jest.fn() },
}));

// SafeAreaContext:渲染时直接透传 children
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const passthrough = ({ children }) => children;
  return {
    SafeAreaProvider: passthrough,
    SafeAreaView: passthrough,
    SafeAreaInsetsContext: React.createContext(insets),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});
