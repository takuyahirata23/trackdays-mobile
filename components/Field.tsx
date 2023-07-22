import React from 'react'
import { View, StyleSheet, TextInput, TextInputProps } from 'react-native'

import { useTheme } from '@hooks/useTheme'
import { Text } from '@components/Text'

type Props = {
  label: string
  error?: string
} & TextInputProps

export function Field({ label, error, ...rest }: Props) {
  const { colors } = useTheme()
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          {
            backgroundColor: colors.bgSecondary,
            borderColor: error ? colors.error : colors.bgSecondary
          },
          styles.input
        ]}
        {...rest}
      />
      {error && (
        <Text color="error" style={styles.label}>
          {error}
        </Text>
      )}
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
    borderRadius: 4,
    borderWidth: 1.5
  }
})
