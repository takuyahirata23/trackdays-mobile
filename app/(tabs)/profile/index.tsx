import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useQuery } from '@apollo/client'

import { AuthContext } from '@context/Auth'
import { USER_QUERY, BEST_LAP_FOR_EACH_TRACK } from '@graphql/queries'
import {  Card, Text, Container, TrackdayLinkCard } from '@components'

import type { Trackday } from '@type/event'

export default function ProfileIndex() {
  //const { signOut } = React.useContext(AuthContext)
  const { loading, data, error } = useQuery(USER_QUERY)
  const bestLapsRes = useQuery(BEST_LAP_FOR_EACH_TRACK)

  if (error || bestLapsRes.error) {
    console.error(error)
    return null
  }

  if (loading || bestLapsRes.loading) {
    return null
  }

  const { name } = data.user

  return (
    <Container style={styles.container}>
      <Card>
        <Text style={[styles.heading, styles.headingMarginBottom]}>
          Profile
        </Text>
        <Card>
          <Text style={styles.heading}>{name}</Text>
        </Card>
      </Card>
      <Card>
        <Text style={[styles.heading, styles.headingMarginBottom]}>
          Personal Bests
        </Text>
        <View style={styles.personalBestWrapper}>
          {bestLapsRes.data?.bestLapForEachTrack.map((trackday: Trackday) => (
            <TrackdayLinkCard key={trackday.id} {...trackday} />
          ))}
        </View>
      </Card>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 24
  },
  heading: {
    fontSize: 20,
    fontWeight: '600'
  },
  personalBestWrapper: {
    rowGap: 8
  },
  headingMarginBottom: {
    marginBottom: 8
  }
})
