import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'

import { AuthContext } from '@context/Auth'
import { Container } from '@components/Container'
import { Text } from '@components/Text'
import { Field } from '@components/Field'
import { Button } from '@components/Button'
import { useTheme } from '@hooks/useTheme'

export default function SignIn() {
  const { signIn, error } = React.useContext(AuthContext)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const {
    colors: { bgPrimary }
  } = useTheme()

  const onPress = () => signIn({ email, password })

  return (
    <SafeAreaView style={[{ backgroundColor: bgPrimary }, styles.safeArea]}>
      <Container>
        <Text style={styles.title}>Welcome back👋</Text>
        <View style={styles.form}>
          <Field
            label="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="your-email@domain.com"
          />
          <Field
            secureTextEntry
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="YoUR.PASSword!"
          />
        </View>
        <View style={styles.button}>
          {error && (
            <View style={styles.error}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <Button onPress={onPress}>Sign in</Button>
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
  }
})
