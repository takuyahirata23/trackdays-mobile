import React from 'react'
import { useNavigation, Link } from 'expo-router'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useMutation } from '@apollo/client'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Button, Container, Card, Text } from '@components'
import { TRACKDAY_NOTE } from '@graphql/queries'
import { DELETE_TRACKDAY_NOTE } from '@graphql/mutations'
import { formatLapTime } from '@functions/lapTimeConverters'
import { useTheme } from '@hooks/useTheme'

export default function TrackdayDetail() {
  const { id } = useLocalSearchParams()
  const { goBack } = useNavigation()
  const {
    colors: { accent, secondary }
  } = useTheme()

  const { data, error, loading } = useQuery(TRACKDAY_NOTE, {
    variables: {
      id
    }
  })

  const [deleteTrackdayNote] = useMutation(DELETE_TRACKDAY_NOTE, {
    update(cache, { data: { deleteTrackdayNote } }) {
      // Remove delete trackday from cache
      cache.evict({ id: cache.identify(deleteTrackdayNote) })
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

  const {
    date,
    lapTime,
    note,
    track,
    motorcycle,
    id: trackdayId
  } = data.trackdayNote

  const handleDelete = () =>
    deleteTrackdayNote({
      variables: {
        id: trackdayId
      }
    })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container style={styles.container}>
        <Card style={{ rowGap: 20 }} sidebarVariant="primary">
          <View
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
          >
            <MaterialCommunityIcons
              name="calendar-today"
              size={18}
              color={accent}
            />
            <Text style={{ color: secondary, fontSize: 14 }}>{date}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>
            {track.facility.name}
          </Text>
          <View style={styles.organization}>
            <MaterialCommunityIcons
              name="go-kart-track"
              size={18}
              color={accent}
            />
            <Text style={{ fontSize: 14 }}>{track.name}</Text>
          </View>
        </Card>
        <Card style={{ rowGap: 20 }} sidebarVariant="primary">
          <View
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
          >
            <MaterialCommunityIcons name="timer" size={18} color={accent} />
            <Text style={{ color: secondary, fontSize: 14 }}>
              {formatLapTime(lapTime)}
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>
            {`${motorcycle.model.make.name} ${motorcycle.model.name}`}
          </Text>
          <Text style={{ color: secondary, fontSize: 14 }}>
            {motorcycle.year}
          </Text>
        </Card>
        {note && (
          <Card>
            <Text>{note}</Text>
          </Card>
        )}
        <View style={styles.btnWrapper}>
          <Button variant="primary" onPress={handleDelete}>
            Delete
          </Button>
          <Link href={{
            pathname: '/trackday/notes/update/[id]',
            params: { id }
          }}>
          Edit
          </Link>
        </View>
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    paddingBottom: 16
  },
  card: {
    flexDirection: 'column',
    rowGap: 8
  },
  heading: {
    fontWeight: '500'
  },
  btnWrapper: {
    marginTop: 'auto',
    rowGap: 12
  },
  organization: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  }
})
