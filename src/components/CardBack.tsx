// 牌背:深紫底 + 金色 ✦ + 装饰边框
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, fontSize } from '../theme/colors';

interface Props {
  style?: ViewStyle;
  small?: boolean;
}

export function CardBack({ style, small = false }: Props) {
  return (
    <View style={[styles.card, small ? styles.small : styles.normal, style]}>
      <View style={styles.outerFrame}>
        <View style={styles.innerFrame}>
          <View style={styles.diamondRow}>
            <Text style={styles.diamond}>✦</Text>
          </View>
          <View style={styles.diamondCol}>
            <Text style={[styles.diamond, small && styles.diamondSmall]}>✦</Text>
          </View>
          <View style={styles.diamondRow}>
            <Text style={styles.diamond}>✦</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.bgDeep,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  normal: {
    width: 120,
    height: 200,
    padding: 8,
  },
  small: {
    width: 64,
    height: 108,
    padding: 4,
  },
  outerFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: 4,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.goldDark,
    borderRadius: radius.sm,
    backgroundColor: colors.bgCard,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  diamondRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  diamondCol: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  diamond: {
    color: colors.gold,
    fontSize: fontSize.heading,
    textShadowColor: colors.goldDark,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  diamondSmall: {
    fontSize: fontSize.title,
  },
});
