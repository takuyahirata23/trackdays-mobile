import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button as RNButton
} from 'react-native'
import { useRouter } from 'expo-router'

import { AuthContext } from '@context/Auth'
import { Container, Text, Field, Button } from '@components'
import { useTheme } from '@hooks/useTheme'
import { validateRegisterForm } from '../../functions/validations'

export type RegisterFormErrors = {
  isValid: boolean
  name?: string
  email?: string
  password?: string
}

export default function Register() {
  const { register, error } = React.useContext(AuthContext)
  const [form, setForm] = React.useState({ email: '', password: '', name: '' })
  const [isLoading, setIsLoading] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<RegisterFormErrors>({
    isValid: false,
    email: '',
    password: ''
  })

  const { push } = useRouter()

  React.useEffect(() => {
    if (formErrors.isValid) {
      setIsLoading(true)
    }
  }, [formErrors])

  React.useEffect(() => {
    if (isLoading) {
      register(form)
    }

    return () => {
      setIsLoading(false)
      setFormErrors({ isValid: false })
    }
  }, [isLoading, form, register])

  const {
    colors: { bgPrimary }
  } = useTheme()

  const onChagneText =
    (field: 'email' | 'password' | 'name') => (value: string) =>
      setForm(prev => ({ ...prev, [field]: value }))

  const onPress = () => setFormErrors(validateRegisterForm(form))

  return (
    <SafeAreaView style={[{ backgroundColor: bgPrimary }, styles.safeArea]}>
      <Container>
        <Text style={styles.title}>Register</Text>
        <View style={styles.form}>
          <Field
            label="Name"
            value={form.name}
            onChangeText={onChagneText('name')}
            placeholder="Your Name"
            error={formErrors.name || error?.fields?.name}
          />
          <Field
            label="Email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={onChagneText('email')}
            placeholder="your-email@domain.com"
            error={formErrors.email || error?.fields?.email}
          />
          <Field
            secureTextEntry
            label="Password"
            value={form.password}
            onChangeText={onChagneText('password')}
            placeholder="YoUR.PASSword!"
            error={formErrors.password || error?.fields?.password}
          />
        </View>
        <View style={styles.button}>
          {error?.message && (
            <View style={styles.error}>
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}
          <Button onPress={onPress}>Register</Button>
        </View>
        <View style={styles.routerButton}>
          <RNButton
            onPress={() => push('/sign-in')}
            title="Have an account? Log in from here"
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
