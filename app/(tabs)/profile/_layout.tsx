import React from 'react'
import { Stack } from 'expo-router'
import { Link } from 'expo-router'

import { Pressable, useColorScheme } from 'react-native'
import Ion from '@expo/vector-icons/Ionicons'

import Colors from '../../../constants/Colors'

export default function ProfileLayout() {
  const colorScheme = useColorScheme()
  return (
    <Stack initialRouteName="index">
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
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          )
        }}
      />
    </Stack>
  )
}
