/* eslint-disable */
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'
import Ion from '@expo/vector-icons/Ionicons'
import { Link, Tabs } from 'expo-router'
import { Pressable, useColorScheme } from 'react-native'

import Colors from '../../constants/Colors'

function FontAwesomeTabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

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
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Motorcycle',
          tabBarIcon: ({ color }) => (
            <TabIcons
              variant="materialCommunity"
              name="motorbike"
              color={color}
            />
          ),
          headerRight: () => (
            <Link
              href={{
                pathname: '/modal',
                params: { name: 'registerMotorcycle' }
              }}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <Ion
                    name="add-circle-outline"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          )
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => (
            <FontAwesomeTabBarIcon name="code" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesomeTabBarIcon name="user-o" color={color} />
          )
        }}
      />
    </Tabs>
  )
}
