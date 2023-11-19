import React from 'react'
import { useNavigation } from 'expo-router'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useMutation } from '@apollo/client'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'

import { Button, Container, Card, Text, IconLabel } from '@components'
import { TRACKDAY_QUERY } from '@graphql/queries'
import { DELETE_TRACKDAY } from '@graphql/mutations'
import { formatLapTime } from '@functions/lapTimeConverters'
import { useTheme } from '@hooks/useTheme'

export default function TrackdayDetail() {
  const { id } = useLocalSearchParams()
  const { goBack } = useNavigation()
  const {
    colors: { primary }
  } = useTheme()

  const { data, error, loading } = useQuery(TRACKDAY_QUERY, {
    variables: {
      id
    }
  })

  const [deleteTrackday] = useMutation(DELETE_TRACKDAY, {
    update(cache, { data: { deleteTrackday } }) {
      // Remove delete trackday from cache
      cache.evict({ id: cache.identify(deleteTrackday) })
      // Remove all of the unreachable cache
      cache.gc()
    },
    onError(e) {
      console.log(e)
    },
    onCompleted() {
      goBack()
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

  const handleDelete = () =>
    deleteTrackday({
      variables: {
        trackdayId: id
      }
    })

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
        <Button variant="secondary" onPress={handleDelete}>
          Delete
        </Button>
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
