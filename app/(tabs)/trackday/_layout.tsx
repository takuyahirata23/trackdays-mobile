import React from 'react'
import { Stack } from 'expo-router'

import { Header } from '@components'

export default function TrackdayLayout() {
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
          title: 'Trackdays'
        }}
      />
      <Stack.Screen
        name="create-trackday-note"
        options={{
          headerShown: true
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: ''
        }}
      />
      <Stack.Screen
        name="notes/[id]"
        options={{
          headerShown: true,
          title: ''
        }}
      />
      <Stack.Screen
        name="notes/update/[id]"
        options={{
          headerShown: true,
          title: ''
        }}
      />
    </Stack>
  )
}
