import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps
} from 'react-native'

import { useTheme } from '@hooks/useTheme'

import { Text } from '@components/Text'

export function Button({ children, ...rest }: TouchableOpacityProps) {
  const {
    colors: { btnPrimary, bgPrimary }
  } = useTheme()

  return (
    <TouchableOpacity
      style={[{ backgroundColor: btnPrimary }, styles.wrapper]}
      {...rest}
    >
      <Text style={[{ color: bgPrimary }, styles.text]}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500'
  }
})
