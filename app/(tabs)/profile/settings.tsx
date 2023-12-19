import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { Octicons, AntDesign } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
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
    paddingBottom: 24
  },
  menuWrapper: {
    rowGap: 20
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
    marginTop: 'auto',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})