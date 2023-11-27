import React from 'react'
import { Stack } from 'expo-router'
//import {  useColorScheme } from 'react-native'

export default function TrackdayLayout() {
  //const colorScheme = useColorScheme()
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
          title: 'Trackdays'
          // headerRight: () => (
          //   <Link
          //     href={{
          //       pathname: '/modal',
          //       params: { name: 'saveTrackday' }
          //     }}
          //     asChild
          //   >
          //     <Pressable>
          //       {({ pressed }) => (
          //         <Ion
          //           name="add-circle-outline"
          //           size={25}
          //           color={Colors[colorScheme ?? 'light'].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // )
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
        name="create-trackday-note"
        options={{
          headerShown: true,
          title: ''
        }}
      />
    </Stack>
  )
}
