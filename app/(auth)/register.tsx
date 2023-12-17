import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button as RNButton,
  Pressable,
  Keyboard
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import BottomSheet from '@gorhom/bottom-sheet'

import { GROUPS_DEV, GROUPS_PROD } from '@constants/groups'
import { AuthContext } from '@context/Auth'
import { Container, Text, Field, Button, BottomSheetHandle } from '@components'
import { useTheme } from '@hooks/useTheme'
import { validateRegisterForm } from '../../functions/validations'

export type RegisterFormErrors = {
  isValid: boolean
  name?: string
  email?: string
  password?: string
  groupId?: string
}

const groups = process.env.NODE_ENV === 'development' ? GROUPS_DEV : GROUPS_PROD

const findCurrentGroup = (id: string) => groups.find(group => group.id === id)

export default function Register() {
  const { register, error } = React.useContext(AuthContext)
  const ref = React.useRef<BottomSheet>(null)
  const [form, setForm] = React.useState({
    email: '',
    password: '',
    name: '',
    groupId: ''
  })
  const [isLoading, setIsLoading] = React.useState(false)
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
      register(form)
    }

    return () => {
      setIsLoading(false)
      setFormErrors({ isValid: false })
    }
  }, [isLoading, form, register])

  const {
    colors: { bgPrimary, bgSecondary }
  } = useTheme()

  const onChangeText =
    (field: 'email' | 'password' | 'name' | 'groupId') => (value: string) =>
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
          <Pressable
            onPress={() => {
              Keyboard.dismiss()
              ref.current?.expand()
            }}
          >
            <Text>Riding Group</Text>
            <Text style={[styles.field, { backgroundColor: bgSecondary }]}>
              {form.groupId
                ? findCurrentGroup(form.groupId)?.name
                : 'Choose your riding group'}
            </Text>
            {formErrors.groupId && <Text>{formErrors.groupId}</Text>}
          </Pressable>
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
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={['40%']}
        handleComponent={() => (
          <BottomSheetHandle
            onPressRight={() => {
              if (!form.groupId) {
                onChangeText('groupId')(groups[0].id)
              }
              ref.current?.close()
            }}
            rightText="Done"
          />
        )}
      >
        <View>
          <Picker
            selectedValue={form.groupId}
            onValueChange={onChangeText('groupId')}
          >
            {groups.map(({ id, name }: { id: string; name: string }) => (
              <Picker.Item value={id} label={name} key={id} />
            ))}
          </Picker>
        </View>
      </BottomSheet>
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
  },
  field: {
    height: 46,
    fontSize: 18,
    padding: 8,
    borderRadius: 4
  }
})
