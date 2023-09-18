import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'

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
      <Container style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.heading}>{track.facility.name}</Text>
          <Text>{track.name}</Text>
        </Card>

        <Card style={styles.iconCard}>
          <MaterialCommunity name="calendar-today" size={24} color="black" />
          <Text>{date}</Text>
        </Card>
        <Card style={styles.iconCard}>
          <MaterialCommunity name="motorbike" size={24} />
          <Text>{`${motorcycle.model.make.name} ${motorcycle.model.name}(${motorcycle.year})`}</Text>
        </Card>
        <Card style={styles.iconCard}>
          <MaterialCommunity name="timer" size={24} />
          <Text>{formatLapTime(lapTime)}</Text>
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
  container: {
    rowGap: 16
  },
  card: {
    flexDirection: 'column',
    rowGap: 8
  },
  heading: {
    fontWeight: '500'
  },
  iconCard: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  }
})
