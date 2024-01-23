import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { Octicons, AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useQuery } from '@apollo/client'

import { AuthContext } from '@context/Auth'
import { USER_QUERY } from '@graphql/queries'
import { Text, Button, Container } from '@components'
import { useTheme } from '@hooks/useTheme'

export default function Setting() {
  const {
    colors: { primary }
  } = useTheme()

  const { signOut } = React.useContext(AuthContext)
  const { client } = useQuery(USER_QUERY, { skip: true })

  const handleSignOut = () => {
    client.clearStore()
    signOut()
  }

  return (
    <Container style={styles.container}>
      <View style={styles.menuWrapper}>
        <Link
          href={{
            pathname: '/profile/motorcycles/register-motorcycle'
          }}
          asChild
        >
          <TouchableOpacity style={styles.buttonWrapper}>
            <MaterialCommunityIcons size={18} name="motorbike" color={primary} />
            <Text style={styles.buttonText}>Register motorcycle</Text>
            <Octicons size={18} name="chevron-right" color={primary} />
          </TouchableOpacity>
        </Link>
        <Link
          href={{
            pathname: '/profile/update-group'
          }}
          asChild
        >
          <TouchableOpacity style={styles.buttonWrapper}>
            <Feather name="flag" size={18} color={primary} />
            <Text style={styles.buttonText}>Update riding group</Text>
            <Octicons size={18} name="chevron-right" color={primary} />
          </TouchableOpacity>
        </Link>
        <Link
          href={{
            pathname: '/profile/update-account-type'
          }}
          asChild
        >
          <TouchableOpacity style={styles.buttonWrapper}>
            <MaterialIcons name="supervisor-account" size={18} color={primary} />
            <Text style={styles.buttonText}>Update account type</Text>
            <Octicons size={18} name="chevron-right" color={primary} />
          </TouchableOpacity>
        </Link>
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
        <Link
          href={{
            pathname: '/profile/delete-account'
          }}
          asChild
        >
          <TouchableOpacity style={styles.buttonWrapper}>
            <AntDesign size={18} name="warning" color={primary} />
            <Text style={styles.buttonText}>Delete account</Text>
            <Octicons size={18} name="chevron-right" color={primary} />
          </TouchableOpacity>
        </Link>
        <Link
          href={{
            pathname: '/profile/faq'
          }}
          asChild
        >
          <TouchableOpacity style={styles.buttonWrapper}>
            <AntDesign size={18} name="questioncircleo" color={primary} />
            <Text style={styles.buttonText}>FAQ</Text>
            <Octicons size={18} name="chevron-right" color={primary} />
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.ctaWrapper}>
        <Button variant="secondary" onPress={handleSignOut}>
          Sign Out
        </Button>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8
  },
  ctaWrapper: {
    marginTop: 'auto',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})
