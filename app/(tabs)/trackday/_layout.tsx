import React from 'react'
import { Stack } from 'expo-router'

import { Header, AddTrackdayToCalendar, NoteEditDone, NoteEditCancel } from '@components'
import { DeleteTrackdayButton } from '@components/modalContents'

export default function TrackdayLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: () => <Header />,
        headerShadowVisible: true,
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Trackdays'
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: '',
          headerRight: AddTrackdayToCalendar
        }}
      />
      <Stack.Screen
        name="notes/[id]"
        options={{
          headerShown: true,
          title: '',
          headerRight: DeleteTrackdayButton
        }}
      />
      <Stack.Screen
        name="notes/create-trackday-note"
        options={{
          headerShown: true
        }}
      />
      <Stack.Screen
        name="notes/edit-note"
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerLeft: NoteEditCancel,
          headerRight: NoteEditDone
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
