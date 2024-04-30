import React from 'react'
import { Stack, Link } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { useTheme } from '@hooks/useTheme'
import { Header } from '@components'
import { DeleteMotorcycleButton } from '@components/modalContents'

export default function ProfileLayout() {
  const {
    colors: { secondary }
  } = useTheme()
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: () => <Header />,
        headerShadowVisible: true
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
          headerRight: () => (
            <Link
              href={{
                pathname: '/profile/settings'
              }}
              asChild
            >
              <TouchableOpacity>
                <AntDesign name="setting" size={25} color={secondary} />
              </TouchableOpacity>
            </Link>
          )
        }}
      />
      <Stack.Screen
        name="change-email"
        options={{
          title: 'Change email'
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings'
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          title: 'Settings'
        }}
      />
      <Stack.Screen
        name="update-group"
      />
      <Stack.Screen
        name="update-account-type"
      />
      <Stack.Screen name="motorcycles/register-motorcycle" />
      <Stack.Screen
        name="motorcycles/[id]"
        options={{
          headerRight: DeleteMotorcycleButton
        }}
      />
      <Stack.Screen
        name="faq"
      />
      <Stack.Screen
        name="donation"
      />
    </Stack>
  )
}
