import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button as RNButton
} from 'react-native'
import { useRouter } from 'expo-router'

import { AuthContext } from '@context/Auth'
import { Container } from '@components/Container'
import { Text } from '@components/Text'
import { Field } from '@components/Field'
import { Button } from '@components/Button'
import { useTheme } from '@hooks/useTheme'
import { validateSignInForm } from '../../functions/validations'

export type SignInFormErrors = {
  isValid: boolean
  email?: string
  password?: string
}

export default function SignIn() {
  const { signIn, error } = React.useContext(AuthContext)
  const [form, setForm] = React.useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<SignInFormErrors>({
    isValid: false,
    email: '',
    password: ''
  })

  const onChagneText = (field: 'email' | 'password') => (value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const {
    colors: { bgPrimary }
  } = useTheme()

  const { push } = useRouter()

  const onPress = () => setFormErrors(validateSignInForm(form))

  React.useEffect(() => {
    if (formErrors.isValid) {
      setIsLoading(true)
    }
  }, [formErrors])

  React.useEffect(() => {
    if (isLoading) {
      signIn(form)
    }

    return () => {
      setIsLoading(false)
      setFormErrors({ isValid: false })
    }
  }, [isLoading, form, signIn])

  return (
    <SafeAreaView style={[{ backgroundColor: bgPrimary }, styles.safeArea]}>
      <Container>
        <Text style={styles.title}>Welcome back👋</Text>
        <View style={styles.form}>
          <Field
            label="Email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={onChagneText('email')}
            placeholder="your-email@domain.com"
            error={formErrors.email}
          />
          <Field
            secureTextEntry
            label="Password"
            value={form.password}
            onChangeText={onChagneText('password')}
            placeholder="YoUR.PASSword!"
            error={formErrors.password}
          />
        </View>
        <View style={styles.button}>
          {error?.message && (
            <View style={styles.error}>
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}
          <Button onPress={onPress}>Sign in</Button>
        </View>
        <View style={styles.routerButton}>
          <RNButton
            onPress={() => push('/register')}
            title="Need an account? Register from here"
          />
        </View>
        <View style={styles.routerButton}>
          <RNButton
            onPress={() => push('/password-update')}
            title="Forgot password?"
          />
        </View>
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  form: {
    rowGap: 16,
    marginTop: 20
  },
  button: {
    marginTop: 32,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '80%'
  },
  title: {
    fontSize: 20,
    fontWeight: '600'
  },
  error: {
    marginBottom: 20
  },
  errorText: {
    textAlign: 'center'
  },
  routerButton: {
    marginTop: 16
  }
})
