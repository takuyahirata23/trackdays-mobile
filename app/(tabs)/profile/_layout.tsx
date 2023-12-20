import React from 'react'
import { Stack, Link } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Ion from '@expo/vector-icons/Ionicons'

import { useTheme } from '@hooks/useTheme'
import { Header } from '@components'

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
                <Ion
                  name="settings"
                  size={25}
                  color={secondary}
                  style={{ marginRight: 15 }}
                />
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
        options={{
          title: 'Settings'
        }}
      />
    </Stack>
  )
}
