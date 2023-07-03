import React from 'react'
import { View, StyleSheet, TextInput, TextInputProps } from 'react-native'

import { useTheme } from '@hooks/useTheme'
import { Text } from '@components/Text'

type Props = {
  label: string
} & TextInputProps

export function Field({ label, ...rest }: Props) {
  const {
    colors: { bgSecondary }
  } = useTheme()
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[{ backgroundColor: bgSecondary }, styles.input]}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14
  },
  input: {
    height: 46,
    fontSize: 18,
    padding: 8,
    borderRadius: 4
  }
})
