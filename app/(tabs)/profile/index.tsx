import React from 'react'
import { StyleSheet } from 'react-native'
import { useQuery } from '@apollo/client'

import { AuthContext } from '@context/Auth'
import { USER_QUERY } from '@graphql/queries'
import { Container } from '@components/Container'
import { Text } from '@components/Text'
import { Button } from '@components/Button'

export default function ProfileIndex() {
  const { signOut } = React.useContext(AuthContext)
  const { loading, data, error } = useQuery(USER_QUERY)

  if (error) {
    console.error(error)
    return null
  }

  if (loading) {
    return null
  }

  const { name } = data.user

  return (
    <Container>
      <Text style={styles.heading}>{name}</Text>
      <Button onPress={signOut}>Sign out</Button>
    </Container>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '600'
  }
})
