import React from 'react'
import { StyleSheet } from 'react-native'

import { Card, Props as CardProps } from './Card'
import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'

type Props = {
  label: string
  icon: React.ReactNode
  variant?: CardProps['variant']
}

export function IconLabel({ icon, label, variant = 'primary' }: Props) {
  const {
    colors: {  secondary }
  } = useTheme()
  return (
    <Card style={styles.wrapper} variant={variant}>
      {icon}
      <Text style={{ color: secondary}}>{label}</Text>
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
