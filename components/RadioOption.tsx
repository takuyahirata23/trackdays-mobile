import React from 'react'
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@hooks/useTheme'

import { Card } from './Card'
import { Text } from './Text'

type Props = {
  onPress: () => void
  label: string
  isSelected: boolean,
  style?: StyleProp<ViewStyle>
}

const getIconName = (predicate: boolean) =>
  predicate ? 'radio-button-on' : 'radio-button-off'

export function RadioOption({ onPress, label, isSelected, style }: Props) {
  const {
    colors: { accent }
  } = useTheme()

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Card style={styles.option}>
        <Ionicons name={getIconName(isSelected)} size={24} color={accent} />
        <Text style={styles.optionText}>{label}</Text>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  },
  optionText: {
    fontSize: 20
  }
})
