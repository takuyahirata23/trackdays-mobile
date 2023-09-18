import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps
} from 'react-native'

import { useTheme } from '@hooks/useTheme'

import { Text } from '@components/Text'

type Props = {
  variant?: 'primary' | 'secondary'
} & TouchableOpacityProps

export function Button({ children, variant = 'primary', ...rest }: Props) {
  const {
    colors: { btnPrimary, btnSecondary, btnBgPrimary, btnBgSecondary }
  } = useTheme()

  const isPrimary = variant === 'primary'

  return (
    <TouchableOpacity
      style={[
        { backgroundColor: isPrimary ? btnBgPrimary : btnBgSecondary },
        styles.wrapper
      ]}
      {...rest}
    >
      <Text
        style={[{ color: isPrimary ? btnPrimary : btnSecondary }, styles.text]}
      >
        {children}
      </Text>
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
