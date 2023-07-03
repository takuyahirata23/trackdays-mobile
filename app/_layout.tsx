import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { AuthProvider } from '@context/Auth'
import * as SecureStore from 'expo-secure-store'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)'
}

const path = `${process.env.DOMAIN_URL}/auth/login`

const body = JSON.stringify({ email: 'admin@test.com', password: 'Pass1234!' })

const fetchUser = () =>
  fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })

function getToken() {
  return SecureStore.getItemAsync('token')
}

export default function RootLayout() {
  const [font, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  })

  const [isReady, setIsReady] = React.useState(true)
  const [token, setToken] = React.useState<null | string>(null)

  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  useEffect(() => {
    getToken().then(x => {
      if (!x) {
        setIsReady(true)
      } else {
        setToken(x)
        setIsReady(true)
      }
    })
  }, [])

  // useEffect(() => {
  //   fetchUser()
  //     .then(x => x.json())
  //     .then(res => {
  //       const { error, token } = res
  //       if (!error && token) {
  //         setToken(token)
  //         setIsTokenLoading(false)
  //       }
  //     })
  //     .catch(console.error)
  // }, [])

  return (
    <>
      {!font || (!isReady && <SplashScreen />)}
      {font && isReady && <RootLayoutNav token={token} />}
    </>
  )
}

function RootLayoutNav({ token }: { token: string | null }) {
  const colorScheme = useColorScheme()

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
