import React from 'react'
import { Stack, Link } from 'expo-router'
import { Pressable } from 'react-native'
import Ion from '@expo/vector-icons/Ionicons'

import { useTheme } from '@hooks/useTheme'

export default function ProfileLayout() {
  const {colors: { primary, secondary} } = useTheme()
  return (
    <Stack initialRouteName="index" screenOptions={{
      headerTintColor: primary 
    }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
          headerRight: () => (
            <Link
              href={{
                pathname: '/modal',
                params: { name: 'settings' }
              }}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <Ion
                    name="add-circle-outline"
                    size={25}
                    color={secondary}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
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
    </Stack>
  )
}
