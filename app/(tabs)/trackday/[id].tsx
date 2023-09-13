import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'

import { Container, Card, Text } from '@components'
import { TRACKDAY_QUERY } from '@graphql/queries'
import { formatLapTime } from '@functions/lapTimeConverters'

export default function TrackdayDetail() {
  const { id } = useLocalSearchParams()

  const { data, error, loading } = useQuery(TRACKDAY_QUERY, {
    variables: {
      id
    }
  })

  if (loading) {
    return null
  }

  if (error) {
    console.error(error)
    return null
  }

  const { date, lapTime, note, track, motorcycle } = data.trackday

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <Card style={styles.card}>
          <Text>{`${motorcycle.model.make.name} ${motorcycle.model.name}(${motorcycle.year})`}</Text>
          <View>
            <Text>{date}</Text>
            <Text>{formatLapTime(lapTime)}</Text>
          </View>
        </Card>
        <Card style={styles.card}>
          <Text>{track.facility.name}</Text>
          <Text>{track.name}</Text>
        </Card>
        {note && (
          <Card>
            <Text>{note}</Text>
          </Card>
        )}
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    rowGap: 8
  }
})
