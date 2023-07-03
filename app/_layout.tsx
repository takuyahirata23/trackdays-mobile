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
import { ApolloProvider } from '@apollo/client'

import { useProtectRoute } from '@hooks/useProtectRoute'
import { client } from '@graphql/client'
import { USER_QUERY } from '@graphql/queries'
import { getToken } from '@utils/secureStore'
import { AuthProvider } from '@context/Auth'

type User = {
  email: string
  name: string
}

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)'
}

export default function RootLayout() {
  const [font, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  })

  const [isReady, setIsReady] = React.useState(false)
  const [token, setToken] = React.useState<null | string>(null)
  const [user, setUser] = React.useState(null)

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
      }
    })
  }, [])

  useEffect(() => {
    if (token) {
      client
        .query({
          query: USER_QUERY
        })
        .then(x => {
          setUser(x.data.user)
          setIsReady(true)
        })
        .catch(console.error)
    }
  }, [token])

  return (
    <>
      {!font || (!isReady && <SplashScreen />)}
      {font && isReady && <RootLayoutNav user={user} setUser={setUser} />}
    </>
  )
}

function RootLayoutNav({ user, setUser }: { user: null | User; setUser: any }) {
  const colorScheme = useColorScheme()

  useProtectRoute(user)

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider setUser={setUser}>
          <ApolloProvider client={client}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </ApolloProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}
