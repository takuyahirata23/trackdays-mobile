import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTheme } from '@hooks/useTheme'
import { useQuery } from '@apollo/client'

import { USER_QUERY } from '@graphql/queries'
import { AuthContext } from '@context/Auth'
import { Text, Button, Container } from '@components'

export default function DeleteAccount() {
  const { deleteAccount } = React.useContext(AuthContext)
  const { client } = useQuery(USER_QUERY, { skip: true })

  const handleDeleteAccount = () => {
    client.clearStore()
    deleteAccount()
  }

  const {
    colors: { error }
  } = useTheme()
  return (
    <Container style={styles.container}>
      <View style={styles.warning}>
        <AntDesign size={60} name="warning" color={error} />
        <Text style={[styles.waringHead, { color: error }]}>
          This will delete everything
        </Text>
      </View>
      <Text style={styles.message}>
        If you are sure to delete your account, please press the button below.
      </Text>
      <View style={styles.btnWrapper}>
        <Button variant="secondary" onPress={handleDeleteAccount}>
          Delete
        </Button>
        <Text style={styles.message}>
          Thank you for using Trackday. Ride safe!
        </Text>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    rowGap: 24
  },
  warning: {
    alignItems: 'center'
  },
  waringHead: {
    fontSize: 20
  },
  btnWrapper: {
    rowGap: 8,
    marginTop: 36,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%'
  },
  message: {
    textAlign: 'center'
  }
})
