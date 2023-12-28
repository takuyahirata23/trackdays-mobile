import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'

import { MOTORCYCLE_QUERY } from '@graphql/queries'
import { Container, Text } from '@components'

export default function Motorcycle() {
  const { id } = useLocalSearchParams()
  const { error, loading, data } = useQuery(MOTORCYCLE_QUERY, {
    variables: { id }
  })

  if (error || loading) {
    return null
  }

  const { model, year } = data.motorcycle

  return (
    <Container>
      <View style={styles.vehicleWrapper}>
        <Text style={styles.name}>
          {model.make.name} {model.name}
        </Text>
        <Text >({year})</Text>
      </View>
      <Text style={{ marginTop: 16}}>Motorcycle features are coming soon...</Text>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {},
  vehicleWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 8
  }
})
