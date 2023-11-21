import React from 'react'
import { StyleSheet } from 'react-native'
import { useSearchParams, useNavigation } from 'expo-router'

import { Container, KeyboardAvoidingView } from '@components'
import { RegisterMotorcycle, Settings } from '@components/modalContents'

const titleMap: { [key: string]: string } = {
  registerMotorcycle: 'Register Motorcycle',
  settings: 'Settings'
}

const contentMap: { [key: string]: React.FC } = {
  registerMotorcycle: RegisterMotorcycle,
  settings: Settings
}

export default function ModalScreen() {
  const { name } = useSearchParams()
  const { setOptions } = useNavigation()

  React.useEffect(() => {
    setOptions({
      title: titleMap[String(name)]
    })
  }, [name, setOptions])

  const Content = contentMap[String(name)]

  return (
    <KeyboardAvoidingView>
      <Container style={styles.container}>
        <Content />
      </Container>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16
  }
})
