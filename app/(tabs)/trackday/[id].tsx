import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'
import { StyleSheet } from 'react-native'

import { TRACKDAY } from '@graphql/queries'

import { Container, Text, Card, IconLabel } from '@components'

export default function TrackdayDetail() {
  const { id } = useLocalSearchParams()
  const {
    data = {},
    loading,
    error
  } = useQuery(TRACKDAY, {
    variables: {
      id
    }
  })

  console.log(error)

  if (loading || error) {
    return null
  }

  const { date } = data.trackday

  console.log(data)

  return (
    <Container style={styles.container}>
      <Card>
        <IconLabel name="timer" label={date} />
      </Card>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16
  },
  card: {
    flexDirection: 'column',
    rowGap: 8
  }
})
