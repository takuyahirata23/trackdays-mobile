import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'

import { Container, Card, Text, IconLabel } from '@components'
import { TRACKDAY_QUERY } from '@graphql/queries'
import { formatLapTime } from '@functions/lapTimeConverters'
import { useTheme } from '@hooks/useTheme'

export default function TrackdayDetail() {
  const { id } = useLocalSearchParams()
  const {
    colors: { primary }
  } = useTheme()

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

        <Card>
          <IconLabel
            icon={
              <MaterialCommunity
                name="calendar-today"
                size={24}
                color={primary}
              />
            }
            label={date}
          />
        </Card>
        <Card>
          <IconLabel
            icon={
              <MaterialCommunity name="motorbike" size={24} color={primary} />
            }
            label={`${motorcycle.model.make.name} ${motorcycle.model.name}(${motorcycle.year})`}
          />
        </Card>
        <Card>
          <IconLabel
            icon={<MaterialCommunity name="timer" size={24} color={primary} />}
            label={formatLapTime(lapTime)}
          />
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
  }
})
