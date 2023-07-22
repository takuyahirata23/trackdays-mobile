import React from 'react'
import { Text as RNText, TextProps, StyleSheet } from 'react-native'

import { useTheme } from '@hooks/useTheme'

export type Props = {
  color?: 'primary' | 'secondary' | 'tertiary' | 'error'
} & TextProps

export function Text({ children, style, color = 'primary' }: Props) {
  const { colors } = useTheme()
  return (
    <RNText style={[{ color: colors[color] }, styles.primary, style]}>
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  primary: {
    fontSize: 16
  }
})
