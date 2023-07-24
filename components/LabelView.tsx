import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'

import { Text } from './Text'

type Props = {
  label: string
  value: string | number
} & ViewProps

export function LableView({ label, value, style, ...rest }: Props) {
  return (
    <View style={[styles.wrapper, style]} {...rest}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  },
  label: {
    fontWeight: '500',
    fontSize: 18
  },
  value: {
    fontWeight: '500',
    fontSize: 16
  }
})
