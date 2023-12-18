import React from 'react'
import { View, StyleSheet } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import { Text } from './Text'
import { useTheme } from '../hooks/useTheme'

type Props = {
  children?: React.ReactNode,
  message: string
}

export function EmailConfirmation({ children, message }: Props) {
  const { colors: { accent } } = useTheme()

  return (
    <View style={styles.wrapper}>
      <MaterialCommunityIcons name="email-check" size={60} color={accent} />
      <Text style={styles.text}>{ message }</Text>
      {children && children}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: '600'
  }
})
