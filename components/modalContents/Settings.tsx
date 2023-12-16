import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import Octicons from '@expo/vector-icons/Octicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useQuery } from '@apollo/client'

import { Text, Button } from '@components'
import { useTheme } from '@hooks/useTheme'
import { USER_QUERY } from '@graphql/queries'
import { AuthContext } from '@context/Auth'

export function Settings() {
  const {
    colors: { primary }
  } = useTheme()
  const { signOut, deleteAccount } = React.useContext(AuthContext)

  const { client } = useQuery(USER_QUERY, { skip: true })

  const handleSignOut = () => {
    client.clearStore()
    signOut()
  }

  const handleDeleteAccount = () => {
    client.clearStore()
    deleteAccount()
  }

  return (
    <View style={styles.container}>
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
      <View style={styles.ctaWrapper}>
        <Button onPress={handleSignOut}>Sign Out</Button>
        <Button onPress={handleDeleteAccount}>Delete Account</Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 36
  },
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
  },
  ctaWrapper: {
    rowGap: 20,
    marginTop: 'auto'
  }
})
