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
    colors: { primary, secondary, tertiary, btnSecondary, btnBgSecondary }
  } = useTheme()

  if (loading || error) {
    return null
  }

  const {
    startDatetime,
    organization,
    track,
    price,
    description,
    trackdaysRegistrationUrl
  } = data.trackday

  return (
    <Container style={styles.container}>
      <Card style={{ rowGap: 20 }} sidebarVariant="secondary">
        <View
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}
        >
          <MaterialCommunityIcons
            name="calendar-today"
            size={18}
            color={tertiary}
          />
          <Text style={{ color: secondary, fontSize: 14 }}>
            {startDatetime}
          </Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '500' }}>
          {track.facility.name}
        </Text>
        <View style={styles.organization}>
          <MaterialCommunityIcons
            name="go-kart-track"
            size={18}
            color={tertiary}
          />
          <Text style={{ fontSize: 14 }}>{track.name}</Text>
        </View>
      </Card>
      <Card style={{ rowGap: 12 }} sidebarVariant="secondary">
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
            <FontAwesome name="dollar" size={18} color={tertiary} />
            <Text style={{ color: secondary, fontSize: 14 }}>
              {String(price)}
            </Text>
          </View>
          {organization.homepageUrl && (
            <ExternalLink href={organization.homepageUrl} asChild>
              <TouchableOpacity>
                <Feather name="external-link" size={20} color={primary} />
              </TouchableOpacity>
            </ExternalLink>
          )}
        </View>
        <Text style={{ fontSize: 18, fontWeight: '500' }}>
          {organization.name}
        </Text>
      </Card>
      {organization.defaultNote || description ? (
        <Card sidebarVariant="secondary">
          {description && <Text style={styles.note}>{description}</Text>}
          {organization.defaultNote && (
            <Text
              style={[styles.note, { marginTop: description ? 16 : 0 }]}
            >{`${organization.defaultNote}`}</Text>
          )}
        </Card>
      ) : null}
      {trackdaysRegistrationUrl || organization.trackdaysRegistrationUrl ? (
        <View style={styles.buttonWrapper}>
          <ExternalLink
            href={
              trackdaysRegistrationUrl || organization.trackdaysRegistrationUrl
            }
            asChild
          >
            <TouchableOpacity
              style={{
                backgroundColor: btnBgSecondary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8
              }}
            >
              <Text style={[styles.buttonText, { color: btnSecondary }]}>
                Book Now!
              </Text>
            </TouchableOpacity>
          </ExternalLink>
        </View>
      ) : null}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20
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
  },
  note: {
    lineHeight: 22,
    fontSize: 15
  }
})
