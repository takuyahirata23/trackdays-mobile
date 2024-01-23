import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'

import { FACILITY_LEADERBOARD_QUERY } from '@graphql/queries'
import { Container, Text, Leaderboard } from '@components'

import type { User } from '@type/accounts'
import type { Motorcycle } from '@type/vehicle'

type LeaderboardItem = {
  user: User
  motorcycle: Motorcycle
  time: number
}

type Track = {
  name: string
  length: number
  trackdayNotes: LeaderboardItem
}

export default function Facility() {
  const { id } = useLocalSearchParams()
  const { data, loading, error } = useQuery(FACILITY_LEADERBOARD_QUERY, {
    variables: {
      facilityId: id
    }
  })

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
        {data.tracksWithLeaderboard.map(
          ({ name, length, trackdayNotes }: Track, i: number) => (
            <View key={i}>
              <View style={styles.trackDetails}>
                <Text style={styles.facilityName}>{name}</Text>
                <Text>{length}km</Text>
              </View>
              <Leaderboard trackdayNotes={trackdayNotes} />
            </View>
          )
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
  trackDetails: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
