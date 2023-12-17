import React from 'react'
import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: 'Motorcycles'
        }}
      />
      <Stack.Screen
        name="register-motorcycle"
        options={{
          title: 'Register Motorcycle'
        }}
      />
    </Stack>
  )
}
