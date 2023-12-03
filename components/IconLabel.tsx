import React from 'react'
import { StyleSheet } from 'react-native'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'

import { Card, Props as CardProps } from './Card'
import { Text } from './Text'
import { useTheme } from '../hooks/useTheme'

type Props = {
  label: string
  name: keyof typeof MaterialCommunity.glyphMap
  variant?: CardProps['variant']
}

export function IconLabel({ name, label, variant = 'primary' }: Props) {
  const {
    colors: { primary }
  } = useTheme()

  return (
    <Card style={styles.wrapper} variant={variant}>
      <MaterialCommunity name={name} size={24} color={primary} />
      <Text>{label}</Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  }
})
