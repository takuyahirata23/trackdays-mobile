import React from 'react'
import { View, StyleSheet } from 'react-native'

import { Text } from './Text'

type Props = {
  icon: React.ReactNode
  label: string
}

export function IconLabel({ icon, label }: Props) {
  return (
    <View style={styles.wrapper}>
      {icon}
      <Text>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  }
})
