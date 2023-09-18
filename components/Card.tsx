import React from 'react'
import { View, ViewProps, StyleSheet } from 'react-native'

import { useTheme } from '@hooks/useTheme'

type Props = {
  variant?: 'primary' | 'secondary'
} & ViewProps

export function Card({ children, style, variant = 'primary' }: Props) {
  const {
    colors: { card, subcard, primary }
  } = useTheme()

  const isPrimary = variant === 'primary'

  return (
    <View
      style={[
        { backgroundColor: isPrimary ? card : subcard, shadowColor: primary },
        styles.card,
        isPrimary ? styles.primary : styles.secondary,
        style
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.15
  },
  primary: {
    padding: 16
  },
  secondary: {
    padding: 8
  }
})
