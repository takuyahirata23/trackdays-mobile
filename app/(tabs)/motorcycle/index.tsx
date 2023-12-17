import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useQuery } from '@apollo/client'
import { useRouter } from 'expo-router'

import { Container, Card, LabelView, Button } from '@components'
import { MOTORCYCLES_QUERY } from '@graphql/queries'

import type { Motorcycle } from '@type/vehicle'

export default function Motorcycles() {
  const { loading, data, error } = useQuery(MOTORCYCLES_QUERY)
  const { push } = useRouter()

  if (loading) {
    return null
  }

  if (error) {
    return null
  }

  const toRegisterScreen = () => push('/motorcycle/register-motorcycle')

  return (
    <Container style={styles.container}>
      {data?.motorcycles?.map(({ id, model, year }: Motorcycle) => (
        <Card key={id}>
          <LabelView
            label={model.make.name}
            value={`${model.name} (${year})`}
          />
        </Card>
      ))}
      <View style={styles.linkWrapper}>
        <Button onPress={toRegisterScreen}>Register motorcycle</Button>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
    paddingBottom: 16
  },
  linkWrapper: {
    marginTop: 'auto',
    justifyContent: 'center'
  },
  linkText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18
  }
})
