import React from 'react'
import { Stack } from 'expo-router'

import { Container, Text } from '@components'

export default function TrackdayDetail() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'yo'
        }}
      />
      <Container>
        <Text>Hey!</Text>
      </Container>
    </>
  )
}
