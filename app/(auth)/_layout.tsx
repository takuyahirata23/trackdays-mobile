import React from 'react'
import { Stack } from 'expo-router'

export default function AuthStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="register"
        options={{
          title: 'Register'
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          title: 'Sign in'
        }}
      />
      <Stack.Screen
        name="password-update"
        options={{
          title: 'Update password'
        }}
      />
    </Stack>
  )
}
