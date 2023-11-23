import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'

import { useTheme } from '@hooks/useTheme'

type Props = {
  children: React.ReactNode
} & ViewProps

export function Container({ children, style }: Props) {
  const {
    colors: { bgPrimary }
  } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: bgPrimary }, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  }
})
