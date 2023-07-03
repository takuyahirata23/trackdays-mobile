import React from 'react'
import { View, StyleSheet } from 'react-native'

import { useTheme } from '@hooks/useTheme'

type Props = {
  children: React.ReactNode
}

export function Container({ children }: Props) {
  const {
    colors: { bgPrimary }
  } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: bgPrimary }]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  }
})
