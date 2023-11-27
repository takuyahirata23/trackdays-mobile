import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useQuery } from '@apollo/client'
import { Link } from 'expo-router'

import { Container, Card, LableView, Text } from '@components'
import { MOTORCYCLES_QUERY } from '@graphql/queries'

import type { Motorcycle } from '@type/vehicle'

export default function Motorcycles() {
  const { loading, data, error } = useQuery(MOTORCYCLES_QUERY)

  if (loading) {
    return null
  }

  if (error) {
    return null
  }

  return (
    <Container style={styles.container}>
      {data?.motorcycles?.map(({ id, model, year }: Motorcycle) => (
        <Card key={id}>
          <LableView
            label={model.make.name}
            value={`${model.name} (${year})`}
          />
        </Card>
      ))}
      <View style={styles.linkWrapper}>
        <Link href={{ pathname: '/motorcycle/register-motorcycle' }}>
          <Text style={styles.linkText}>Register motorcycle</Text>
        </Link>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8
  },
  linkWrapper: {
    marginTop: 8
  },
  linkText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18
  }
})
