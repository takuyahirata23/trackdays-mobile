import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'
import { StyleSheet, View } from 'react-native'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'
import Octicons from '@expo/vector-icons/Octicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import { TRACKDAY } from '@graphql/queries'
import { useTheme } from '@hooks/useTheme'

import { Container, Text, Card, IconLabel, ExternalLink } from '@components'

export default function TrackdayDetail() {
  const { id } = useLocalSearchParams()
  const {
    data = {},
    loading,
    error
  } = useQuery(TRACKDAY, {
    variables: {
      id
    }
  })
  const {
    colors: { primary }
  } = useTheme()

  if (loading || error) {
    return null
  }

  const { date, organization, track, price, description } = data.trackday

  return (
    <Container style={styles.container}>
      <Card style={{ rowGap: 20 }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
        >
          <MaterialCommunity name="calendar-today" size={22} color={primary} />
          <Text>{date}</Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>
          {track.facility.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8
          }}
        >
          <MaterialCommunity name="go-kart-track" size={22} color={primary} />
          <Text>{track.name}</Text>
        </View>
      </Card>
      <Card style={{ rowGap: 20 }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
        >
          <FontAwesome name="dollar" size={22} color={primary} />
          <Text>{String(price)}</Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>
          {organization.name}
        </Text>
        {description && <Text>{description}</Text>}
      </Card>
      <View style={styles.button}>
        <ExternalLink
          href={organization.trackdaysRegistrationUrl || ''}
          asChild
        >
          Book Now!
        </ExternalLink>
      </View>
    </Container>
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
  button: {
    marginTop: 'auto'
  }
})
