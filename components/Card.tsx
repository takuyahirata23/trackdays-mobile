import React from 'react'
import { View, ViewProps, StyleSheet } from 'react-native'

import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'

type Props = {
  variant?: 'primary' | 'secondary'
  heading?: string
} & ViewProps

export function Card({ children, style, variant = 'primary', heading }: Props) {
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
      {heading && <Text style={styles.heading}>{heading}</Text>}
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
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  }
})
