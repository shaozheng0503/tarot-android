// 复制 / 分享解读文本的按钮组。
// 复制成功后短暂提示「已复制」;复制不可用时自动走系统分享。
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { copyText, shareText } from '../utils/share';

interface Props {
  /** 惰性生成待复制/分享的文本 */
  getText: () => string;
}

export function ShareActions({ getText }: Props) {
  const [hint, setHint] = useState<string | null>(null);

  const flash = (msg: string) => {
    setHint(msg);
    setTimeout(() => setHint(null), 1800);
  };

  const onCopy = async () => {
    HapticFeedback.trigger('impactLight');
    const result = await copyText(getText());
    if (result === 'copied') flash('✦ 已复制,去 AI 里粘贴吧');
    else if (result === 'shared') flash('✦ 已分享');
  };

  const onShare = async () => {
    HapticFeedback.trigger('impactLight');
    await shareText(getText());
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          onPress={onCopy}
          style={({ pressed }) => [styles.btn, styles.primary, pressed && styles.pressed]}
        >
          <Text style={styles.primaryText}>⧉ 复制解读</Text>
        </Pressable>
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [styles.btn, styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryText}>↗ 分享</Text>
        </Pressable>
      </View>
      <Text style={styles.caption}>
        {hint ?? '复制后可直接粘贴到任意 AI,获得个性化深度解读'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  btn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.bgCard,
    borderColor: colors.gold,
  },
  primaryText: {
    color: colors.goldBright,
    fontSize: fontSize.body,
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  pressed: { opacity: 0.7 },
  caption: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
});
