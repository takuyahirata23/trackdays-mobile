import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'

import { sendPasswordUpdateRequest } from '@rest/auth'
import { validateEmailForm } from '@functions/validations'
import { useTheme } from '@hooks/useTheme'
import { Container, Text, Field, Button } from '@components'

export type EmailFormErrors = {
  isValid: boolean
  email?: string
}

export default function PasswordUpdate() {
  const {
    colors: { bgPrimary }
  } = useTheme()
  const { push } = useRouter()
  const [email, setEmail] = React.useState('')
  const [hasEmailBeenSent, setHasEmailBeenSent] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<EmailFormErrors>({
    isValid: false,
    email: ''
  })

  React.useEffect(() => {
    if (formErrors.isValid) {
      setIsLoading(true)
    }
  }, [formErrors])

  React.useEffect(() => {
    if (isLoading) {
      sendPasswordUpdateRequest({ email })
        .then(d => {
          if (d.error) {
            setFormErrors({ isValid: false, email: d.message })
          } else {
            setFormErrors({ isValid: false, email: '' })
            setHasEmailBeenSent(true)
          }
        })
        .catch(e => console.error('e', e))
    }

    return () => {
      setIsLoading(false)
      setFormErrors({ isValid: false })
    }
  }, [isLoading, email])

  const onPress = () => setFormErrors(validateEmailForm({ email }))

  return (
    <SafeAreaView style={[{ backgroundColor: bgPrimary }, styles.safeArea]}>
      <Container style={styles.container}>
        {hasEmailBeenSent ? (
          <>
            <Text style={styles.title}>Please check your email box.</Text>
            <Button onPress={() => push('/sign-in')}>Login screen</Button>
          </>
        ) : (
          <>
            <Text style={styles.title}>
              Please type your email to send a link to update your password.
            </Text>
            <Field
              value={email}
              onChangeText={setEmail}
              label="Email"
              keyboardType="email-address"
              placeholder="your-email@domain.com"
              error={formErrors.email}
            />
            <View style={styles.button}>
              <Button onPress={onPress}>Send</Button>
            </View>
          </>
        )}
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  button: {
    marginTop: 32,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24
  },
  container: {
    paddingTop: 40
  }
})
