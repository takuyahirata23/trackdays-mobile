import React from 'react'
import { Stack } from 'expo-router'

export default function TrackdayLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  )
}
