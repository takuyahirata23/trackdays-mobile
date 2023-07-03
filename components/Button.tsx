import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps
} from 'react-native'

import { Text } from '@components/Text'

export function Button({ children, ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity style={styles.wrapper} {...rest}>
      <Text>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8
  }
})
