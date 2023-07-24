import React from 'react'
import { StyleSheet } from 'react-native'
import { useQuery } from '@apollo/client'

import { Container, Card, LableView } from '@components'
import { MOTORCYCLES_QUERY } from '@graphql/queries'

import type { Motorcycle } from '@type/vehicle'

export default function MotorcycleScreen() {
  const { loading, data } = useQuery(MOTORCYCLES_QUERY)

  return (
    <Container style={styles.container}>
      {data?.motorcycles?.map(({ id, make, model }: Motorcycle) => (
        <Card>
          <LableView key={id} label={make} value={model} />
        </Card>
      ))}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8
  },
  divider: {
    marginTop: 12
  }
})
