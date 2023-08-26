import React from 'react'
import { Stack } from 'expo-router'
import { Link } from 'expo-router'
import { Pressable, useColorScheme } from 'react-native'
import Ion from '@expo/vector-icons/Ionicons'

import Colors from '../../../constants/Colors'

export default function TrackdayLayout() {
  const colorScheme = useColorScheme()
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Trackdays',
          headerRight: () => (
            <Link
              href={{
                pathname: '/modal',
                params: { name: 'saveTrackday' }
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
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  )
}
