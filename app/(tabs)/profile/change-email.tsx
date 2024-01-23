import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery } from '@apollo/client'
import IonIcons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'

import { USER_QUERY } from '@graphql/queries'
import { Text, Container, Field, Button, EmailConfirmation } from '@components'
import { validateSignInForm } from '@functions/validations'
import { sendEmailUpdateRequest } from '@rest/auth'

export type EmailUpdateFormErrors = {
  isValid: boolean
  email?: string
}

export default function ChangeEmail() {
  const { loading, data, error } = useQuery(USER_QUERY)
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const { push } = useRouter()
  const [hasEmailBeenSent, setHasEmailBeenSent] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<EmailUpdateFormErrors>({
    isValid: false,
    email: ''
  })

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error</Text>
  }

  React.useEffect(() => {
    if (formErrors.isValid) {
      setIsLoading(true)
    }
  }, [formErrors])

  React.useEffect(() => {
    if (isLoading) {
      sendEmailUpdateRequest({ email })
        .then(x => {
          if (!x.error) {
            setHasEmailBeenSent(true)
          }
        })
        .catch(() => {
          setErrorMessage(
            'There was a problem updating your email. Please try it later.'
          )
        })
    }

    return () => {
      setIsLoading(false)
      setFormErrors({ isValid: false })
    }
  }, [isLoading, email])

  const onPress = () => setFormErrors(validateSignInForm({ email }))

  return (
    <Container style={styles.container}>
      {hasEmailBeenSent ? (
        <EmailConfirmation message="Verification Email has been sent!">
          <Button onPress={() => push('/profile')} variant="secondary">
            Back to profile
          </Button>
        </EmailConfirmation>
      ) : (
        <>
          <Field
            onChangeText={setEmail}
            label="Email"
            value={email}
            placeholder={data.user.email}
            keyboardType="email-address"
            error={formErrors.email}
          />
          <View style={styles.warningWrapper}>
            <IonIcons name="information-circle-outline" size={24} />
            <Text color="secondary" style={styles.warningText}>
              Please verify your email again after changing your email.
            </Text>
          </View>
          {errorMessage && (
            <Text color="error" style={styles.warningText}>
              Please verify your email again after changing your email.
            </Text>
          )}
          <Button onPress={onPress} disabled={isLoading}>
            Change email
          </Button>
        </>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    rowGap: 16
  },
  warningWrapper: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  },
  warningText: {
    flex: 1
  }
})
