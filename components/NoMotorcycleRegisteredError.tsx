import React from 'react'
import { StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

import { Button } from './Button'
import { Container } from './Container'
import { Text } from './Text'

export function NoMotorcycleRegisteredError() {
  const { push } = useRouter()
  const navigateToMotorcycleRegistration = () =>
    push('/profile/motorcycles/register-motorcycle')

  return (
    <Container style={styles.container}>
      <Text style={styles.msg}>Let's make sure you have motorcycles registered!</Text>
      <Button onPress={navigateToMotorcycleRegistration}>
        Motorcycle Registration Page
      </Button>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 28
  },
  msg: {
    fontSize: 18,
    fontWeight: '600',
  }
})
