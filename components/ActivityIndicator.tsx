import React from 'react'
import {
  ActivityIndicator as RNActivityIndicator,
  StyleSheet
} from 'react-native'

import { useTheme } from '@hooks/useTheme'
import { Container } from './Container'

export function ActivityIndicator() {
  const {
    colors: { accent }
  } = useTheme()

  return (
    <Container style={styles.container}>
      <RNActivityIndicator color={accent} />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  }
})
