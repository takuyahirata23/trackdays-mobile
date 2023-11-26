import React from 'react'
import { StyleSheet } from 'react-native'
import { useQuery } from '@apollo/client'
import { Link } from 'expo-router'

import { Container, Card, LableView } from '@components'
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
      <Link href={{ pathname: '/motorcycle/register-motorcycle' }}>
        Register
      </Link>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8
  }
})
