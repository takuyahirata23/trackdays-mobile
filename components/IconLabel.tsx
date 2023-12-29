import React from 'react'
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native'

import { Card, Props as CardProps } from './Card'
import { Text  } from './Text'
import { useTheme } from '@hooks/useTheme'

type Props = {
  label: string
  icon: React.ReactNode
  variant?: CardProps['variant']
  cardStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export function IconLabel({
  icon,
  label,
  variant = 'primary',
  cardStyle,
  textStyle
}: Props) {
  const {
    colors: { secondary }
  } = useTheme()
  return (
    <Card style={[styles.wrapper, cardStyle && cardStyle]} variant={variant}>
      {icon}
      <Text
        style={[styles.label, { color: secondary }, textStyle && textStyle]}
      >
        {label}
      </Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  },
  label: {
    fontSize: 14
  }
})
