import React from 'react'
import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
    </Stack>
  )
}
