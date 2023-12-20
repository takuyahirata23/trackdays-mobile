import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useProtectRoute } from '@hooks/useProtectRoute'
import { client } from '@graphql/client'
import { USER_QUERY } from '@graphql/queries'
import { getToken } from '@utils/secureStore'
import { AuthProvider } from '@context/Auth'
import { ThemeProvider } from '@context/Theme'

import { User } from '@type/accounts'

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
        .catch(() => {
          setIsReady(true)
        })
    }
  }, [token])

  if (!font || !isReady) {
    return null
  }

  return <RootLayoutNav user={user} setUser={setUser} />
}

function RootLayoutNav({ user, setUser }: { user: null | User; setUser: any }) {
  useProtectRoute(user)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
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
    </GestureHandlerRootView>
  )
}
