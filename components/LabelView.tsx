import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'

import { Text } from './Text'

type Props = {
  label: string
  value: string | number
} & ViewProps

export function LabelView({ label, value, style, ...rest }: Props) {
  return (
    <View style={style} {...rest}>
      <Text numberOfLines={1} ellipsizeMode="tail">
        <Text style={styles.label}>{label}:&nbsp;</Text>
        <Text>{value}</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
  }
})
