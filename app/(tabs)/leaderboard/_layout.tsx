import React from 'react'
import { Stack } from 'expo-router'

import { Header } from '@components'

export default function LeaderboardLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerTitle: () => <Header />,
        headerBackTitleVisible: false,
        headerShadowVisible: true
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  )
}
