import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'
import { isEmpty, not } from 'ramda'

import { MOTORCYCLE_QUERY } from '@graphql/queries'
import { Container, Text, TrackdayNoteLinkCard } from '@components'

import type { TrackdayNote } from '@type/event'

export default function Motorcycle() {
  const { id } = useLocalSearchParams()
  const { error, loading, data } = useQuery(MOTORCYCLE_QUERY, {
    variables: { id }
  })

  if (error || loading) {
    return null
  }

  const { model, year, trackdayNotes } = data.motorcycle

  return (
    <Container>
      <View style={styles.vehicleWrapper}>
        <Text style={styles.name}>
          {model.make.name} ({year})
        </Text>
        <Text>{model.name}</Text>
      </View>
      <View style={styles.contentWrapper}>
        {not(isEmpty(trackdayNotes)) && (
          <View>
            <Text style={styles.sectionHeading}>Latest Trackday Notes</Text>
            <View style={styles.sectionWrapper}>
              {trackdayNotes.map((trackdayNote: TrackdayNote) => (
                <TrackdayNoteLinkCard key={trackdayNote.id} {...trackdayNote} showDate showSubtitle/>
              ))}
            </View>
          </View>
        )}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {},
  vehicleWrapper: {
    rowGap: 4
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 8
  },
  contentWrapper: {
    rowGap: 24,
    marginTop: 24
  },
  sectionWrapper: {
    rowGap: 8
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8
  }
})
