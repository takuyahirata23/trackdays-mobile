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
      <IconLabel
        icon={<MaterialCommunity name="timer" size={24} color={primary} />}
        label={date}
      />
      <IconLabel
        icon={<Octicons name="organization" size={24} color={primary} />}
        label={organization.name}
      />
      <IconLabel
        icon={
          <MaterialCommunity name="track-light" size={24} color={primary} />
        }
        label={track.facility.name}
      />
      <IconLabel
        icon={
          <MaterialCommunity name="go-kart-track" size={24} color={primary} />
        }
        label={track.name}
      />
      <IconLabel
        icon={<FontAwesome name="dollar" size={24} color={primary} />}
        label={String(price)}
      />
      {description && (
        <Card>
          <Text>{description}</Text>
        </Card>
      )}
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
