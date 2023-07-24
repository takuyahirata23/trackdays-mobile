import React from 'react'
import {
  Platform,
  StyleSheet,
  KeyboardAvoidingView as RNKeyboardAvoidingView
} from 'react-native'

type Props = {
  children: React.ReactNode
}

export function KeyboardAvoidingView({ children }: Props) {
  return (
    <RNKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {children}
    </RNKeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
