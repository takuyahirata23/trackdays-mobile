import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@apollo/client'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather
} from '@expo/vector-icons'

import { TRACKDAY } from '@graphql/queries'
import { useTheme } from '@hooks/useTheme'

import { Container, Text, Card, ExternalLink } from '@components'

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
    colors: { primary, secondary, tertiary, accent, btnPrimary, btnBgPrimary }
  } = useTheme()

  if (loading || error) {
    return null
  }

  const {
    date,
    organization,
    track,
    price,
    description,
    trackdaysRegistrationUrl
  } = data.trackday

  return (
    <Container style={styles.container}>
      <Card style={{ rowGap: 20 }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
        >
          <MaterialCommunityIcons
            name="calendar-today"
            size={22}
            color={tertiary}
          />
          <Text style={{ color: secondary }}>{date}</Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>
          {track.facility.name}
        </Text>
        <View style={styles.organization}>
          <MaterialCommunityIcons
            name="go-kart-track"
            size={22}
            color={tertiary}
          />
          <Text>{track.name}</Text>
        </View>
      </Card>
      <Card style={{ rowGap: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
          >
            <FontAwesome name="dollar" size={22} color={tertiary} />
            <Text style={{ color: secondary }}>{String(price)}</Text>
          </View>
          {organization.homepageUrl && (
            <ExternalLink href={organization.homepageUrl} asChild>
              <TouchableOpacity>
                <Feather name="external-link" size={22} color={primary} />
              </TouchableOpacity>
            </ExternalLink>
          )}
        </View>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>
          {organization.name}
        </Text>
        {description && <Text>{description}</Text>}
      </Card>
      <View style={styles.buttonWrapper}>
        <ExternalLink
          href={
            trackdaysRegistrationUrl || organization.trackdaysRegistrationUrl
          }
          asChild
        >
          <TouchableOpacity
            style={{
              backgroundColor: btnBgPrimary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8
            }}
          >
            <Text style={[styles.buttonText, { color: btnPrimary }]}>
              Book Now!
            </Text>
          </TouchableOpacity>
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
  buttonWrapper: {
    marginTop: 'auto'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500'
  },
  organization: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  }
})
