import React from 'react'
import { Text as RNText, TextProps, StyleSheet } from 'react-native'

import { useTheme } from '@hooks/useTheme'

export function Text({ children, style }: TextProps) {
  const {
    colors: { primary }
  } = useTheme()
  return (
    <RNText style={[{ color: primary }, styles.primary, style]}>
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  primary: {
    fontSize: 16
  }
})
