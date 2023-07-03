import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Pressable,
  View,
  TextInput,
  Text
} from 'react-native'

import { AuthContext } from '@context/Auth'

export default function SignIn() {
  const { signIn } = React.useContext(AuthContext)
  const [email, setEmail] = React.useState('admin@test.com')
  const [password, setPassword] = React.useState('Pass1234!')

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput value={email} style={styles.input} />
        <TextInput value={password} style={styles.input} />
        <Pressable onPress={signIn}>
          <Text style={styles.input}>Sign in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: '#ffffff',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    color: '#ffffff',
    padding: 10
  }
})
