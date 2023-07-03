import React from 'react'
import { StyleSheet } from 'react-native'
import { useQuery } from '@apollo/client'

import { Container } from '@components/Container'
import { Text } from '@components/Text'
import { USER_QUERY } from '@graphql/queries'

export default function ProfileIndex() {
  const {
    data: { user }
  } = useQuery(USER_QUERY, {
    fetchPolicy: 'cache-only'
  })

  return (
    <Container>
      <Text style={styles.heading}>{user.name}</Text>
    </Container>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '600'
  }
})
