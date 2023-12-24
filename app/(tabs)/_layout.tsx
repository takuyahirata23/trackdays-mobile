import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'
import { Tabs } from 'expo-router'
import { useTheme } from '@hooks/useTheme'

const icon: { [key: string]: any } = {
  fontAwesome: FontAwesome,
  materialCommunity: MaterialCommunity
}

function TabIcons(props: {
  name: React.ComponentProps<
    typeof FontAwesome | typeof MaterialCommunity
  >['name']
  color: string
  variant: 'fontAwesome' | 'materialCommunity'
}) {
  const Icon = icon[props.variant]
  return <Icon size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const {
    colors: { accent }
  } = useTheme()

  return (
    <Tabs
      initialRouteName="/trackday"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: accent
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="trackday"
        options={{
          title: 'Trackday',
          tabBarIcon: ({ color }) => (
            <TabIcons
              variant="materialCommunity"
              name="go-kart-track"
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="motorcycle"
        options={{
          title: 'Motorcycle',
          tabBarIcon: ({ color }) => (
            <TabIcons
              variant="materialCommunity"
              name="motorbike"
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabIcons
              variant="materialCommunity"
              name="racing-helmet"
              color={color}
            />
          )
        }}
      />
    </Tabs>
  )
}
