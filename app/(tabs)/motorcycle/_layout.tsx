import React from 'react'
import { Stack } from 'expo-router'

import { Header } from '@components'

export default function ProfileLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: 'Motorcycles',
          headerTitle: () => <Header />,
          headerBackTitleVisible: false,
          headerShadowVisible: true
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
