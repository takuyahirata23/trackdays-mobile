import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import Octicons from '@expo/vector-icons/Octicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import { Text } from '@components'
import { useTheme } from '@hooks/useTheme'

export function Settings() {
  const {
    colors: { primary }
  } = useTheme()

  return (
    <View>
      <Link
        href={{
          pathname: '/profile/change-email'
        }}
        asChild
      >
        <TouchableOpacity style={styles.buttonWrapper}>
          <MaterialIcons size={18} name="alternate-email" color={primary} />
          <Text style={styles.buttonText}>Change email</Text>
          <Octicons size={18} name="chevron-right" color={primary} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8
  }
})
