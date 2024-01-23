import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'

import { AuthContext } from '@context/Auth'
import {
  Container,
  Text,
  Field,
  Button,
  EmailConfirmation,
  GroupSelect,
  KeyboardAvoidingView
} from '@components'
import { validateRegisterForm } from '../../functions/validations'

export type RegisterFormErrors = {
  isValid: boolean
  name?: string
  email?: string
  password?: string
  groupId?: string
}

export default function Register() {
  const { register, error } = React.useContext(AuthContext)
  const [form, setForm] = React.useState({
    email: '',
    password: '',
    name: '',
    groupId: ''
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasEmailBeenSent, setHasEmailBeenSent] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<RegisterFormErrors>({
    isValid: false,
    email: '',
    password: '',
    groupId: ''
  })

  const { push } = useRouter()

  React.useEffect(() => {
    if (formErrors.isValid) {
      setIsLoading(true)
    }
  }, [formErrors])

  React.useEffect(() => {
    if (isLoading) {
      register(form, d => {
        setIsLoading(false)
        if (d.error) {
          setFormErrors({
            isValid: false,
            ...d.errors
          })
        } else {
          setHasEmailBeenSent(true)
          setFormErrors({ isValid: false })
        }
      })
    }

    return () => {
      setIsLoading(false)
      setFormErrors({ isValid: false })
    }
  }, [isLoading, form, register])

  const onChangeText =
    (field: 'email' | 'password' | 'name' | 'groupId') => (value: string) =>
      setForm(prev => ({ ...prev, [field]: value }))

  const onPress = () => setFormErrors(validateRegisterForm(form))
  const navigateToLoginScreen = () => push('/sign-in')

  return (
    <KeyboardAvoidingView>
      <Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {hasEmailBeenSent ? (
            <EmailConfirmation message="Verification Email has been sent!">
              <Button onPress={navigateToLoginScreen} variant="secondary">
                Login
              </Button>
            </EmailConfirmation>
          ) : (
            <>
              <Text style={styles.title}>Register</Text>
              <View style={styles.form}>
                <Field
                  label="Name"
                  value={form.name}
                  onChangeText={onChangeText('name')}
                  placeholder="Your Name"
                  error={formErrors.name || error?.fields?.name}
                />
                <Field
                  label="Email"
                  keyboardType="email-address"
                  value={form.email}
                  onChangeText={onChangeText('email')}
                  placeholder="your-email@domain.com"
                  error={formErrors.email || error?.fields?.email}
                />
                <Field
                  secureTextEntry
                  label="Password"
                  value={form.password}
                  onChangeText={onChangeText('password')}
                  placeholder="YoUR.PASSword!"
                  error={formErrors.password || error?.fields?.password}
                />
                <GroupSelect
                  selected={form.groupId}
                  onChange={onChangeText('groupId')}
                  error={formErrors.groupId}
                />
              </View>
              <View style={styles.button}>
                {error?.message && (
                  <View style={styles.error}>
                    <Text style={styles.errorText}>{error.message}</Text>
                  </View>
                )}
                <Button onPress={onPress} disabled={isLoading}>
                  Register
                </Button>
              </View>
              <View style={{ marginBottom: 64 }}>
                <View style={styles.routerButton}>
                  <Text>Have an account?</Text>
                  <Button onPress={() => push('/sign-in')} variant="secondary">
                    Log in from here
                  </Button>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </Container>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 20
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
    marginTop: 28,
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    rowGap: 8
  },
  field: {
    height: 46,
    fontSize: 18,
    padding: 8,
    borderRadius: 4
  }
})
