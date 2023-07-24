import React from 'react'
import { View, ViewProps, StyleSheet } from 'react-native'

import { useTheme } from '@hooks/useTheme'

export function Card({ children, style }: ViewProps) {
  const {
    colors: { background, primary }
  } = useTheme()
  return (
    <View
      style={[
        { backgroundColor: background, shadowColor: primary },
        styles.card,
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
    shadowOpacity: 0.1
  }
})
