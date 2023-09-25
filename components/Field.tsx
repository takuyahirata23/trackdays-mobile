import React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle
} from 'react-native'

import { useTheme } from '@hooks/useTheme'
import { Text } from '@components/Text'

type Props = {
  label: string
  error?: string | string[]
  inputStyle?: ViewStyle
} & TextInputProps

export function Field({
  label,
  error,
  style,
  inputStyle = {},
  ...rest
}: Props) {
  const { colors } = useTheme()
  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          {
            backgroundColor: colors.bgSecondary,
            borderColor: error ? colors.error : colors.bgSecondary
          },
          styles.input,
          inputStyle
        ]}
        {...rest}
      />
      {error && typeof error === 'string' && (
        <Text color="error" style={styles.label}>
          {error}
        </Text>
      )}
      {error &&
        Array.isArray(error) &&
        error.map((e: string, i: number) => (
          <Text color="error" style={styles.label} key={i}>
            {e}
          </Text>
        ))}
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
