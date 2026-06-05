// 错误边界:任一屏幕渲染崩溃时,显示可恢复的兜底界面而非整屏白屏。
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/colors';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown) {
    // 保留在控制台,便于开发期定位
    console.error('[ErrorBoundary]', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.wrap}>
        <Text style={styles.icon}>✦</Text>
        <Text style={styles.title}>牌面被一阵迷雾遮住了</Text>
        <Text style={styles.subtitle}>刚才出了点小状况,重试一次即可继续。</Text>
        {__DEV__ && this.state.message ? (
          <Text style={styles.debug} numberOfLines={4}>{this.state.message}</Text>
        ) : null}
        <Pressable
          onPress={this.handleReset}
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="重试"
        >
          <Text style={styles.btnText}>重试</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgPrimary,
    padding: spacing.xl,
  },
  icon: {
    color: colors.gold,
    fontSize: 56,
    marginBottom: spacing.md,
    textShadowColor: colors.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  debug: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  btn: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
  },
  pressed: { opacity: 0.7 },
  btnText: {
    color: colors.bgPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
});
