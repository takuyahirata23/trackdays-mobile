import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'

import { FACILITY_LEADERBOARD_AND_AVERAGE_TIMES_QUERY } from '@graphql/queries'
import {AverageLapTimes ,Container, Text, Leaderboard } from '@components'

import type { User, Group } from '@type/accounts'
import type { Motorcycle } from '@type/vehicle'

type LeaderboardItem = {
  user: User
  motorcycle: Motorcycle
  time: number
}

type AverageLapTime = {
  group: Group
  averageLapTime: number
}

type Track = {
  id: string
  name: string
  length: number
  trackdayNotes: LeaderboardItem
  averageLapTimes: AverageLapTime[]
}

export default function Facility() {
  const { id } = useLocalSearchParams()
  const { data, loading, error } = useQuery(
    FACILITY_LEADERBOARD_AND_AVERAGE_TIMES_QUERY,
    {
      variables: {
        facilityId: id
      }
    }
  )

  if (loading || error) {
    return null
  }


  const { name, description } = data.facility

  return (
    <Container style={styles.container}>
      <View style={styles.facilityWrapper}>
        <Text style={styles.facilityName}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.trackWrapper}>
        {data.tracksWithLeaderboardAndAverageLapTimes.map(
          ({ name, length, trackdayNotes, averageLapTimes}: Track, i: number) => {
            return (
              <View key={i} style={styles.eachTrackWrapper}>
                <View style={styles.trackDetails}>
                  <Text style={styles.facilityName}>{name}</Text>
                  <Text>{length}km</Text>
                </View>
                <AverageLapTimes averageLapTimes={averageLapTimes}/>
                <Leaderboard trackdayNotes={trackdayNotes} />
              </View>
            )
          }
        )}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    rowGap: 24
  },
  facilityWrapper: {
    rowGap: 16
  },
  facilityName: {
    fontSize: 20,
    fontWeight: '500'
  },
  description: {
    fontSize: 14
  },
  trackWrapper: {
    rowGap: 24
  },
  eachTrackWrapper: {
    rowGap: 16
  },
  trackDetails: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
