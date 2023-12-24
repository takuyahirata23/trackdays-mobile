import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery } from '@apollo/client'
import { isEmpty } from 'ramda'

import { UPCOMING_TRACKDAYS } from '@graphql/queries'
import { TrackdayLinkCard } from './TrackdayLinkCard'
import { Text } from './Text'

import type { Trackday } from '@type/event'

export function UpcomingTrackdays() {
  const { data, loading, error } = useQuery(UPCOMING_TRACKDAYS)

  if (loading || error) {
    return null
  }
  return isEmpty(data.upcomingTrackdays) ? null : (
    <View style={styles.wrapper}>
      <Text style={styles.sectionHeading}>Upcoming Trackdays</Text>
      <View style={styles.wrapper}>
        {data.upcomingTrackdays.map((trackday: Trackday) => (
          <TrackdayLinkCard key={trackday.id} {...trackday} showDate />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    rowGap: 8
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '500'
  }
})
