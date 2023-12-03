import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import Octicons from '@expo/vector-icons/Octicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import { Card } from './Card'
import { IconLabel } from './IconLabel'
import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'
import { ExternalLink } from './ExternalLink'

import type { Trackday } from '@type/event'

export function TrackdayLinkCard({ id, track, price, organization }: Trackday) {
  const {
    colors: { primary }
  } = useTheme()

  return (
    <Link
      href={{
        pathname: '/trackday/[id]',
        params: { id }
      }}
      asChild
    >
      <TouchableOpacity>
        <Card>
          <Text style={styles.cardTitle}>{track.facility.name}</Text>
          <View style={styles.cardDetail}>
            <Card variant="secondary">
              <IconLabel
                icon={
                  <Octicons name="organization" size={24} color={primary} />
                }
                label={organization.name}
              />
            </Card>
            <Card variant="secondary">
              <IconLabel
                icon={<FontAwesome name="dollar" size={24} color={primary} />}
                label={String(price)}
              />
            </Card>
          </View>
        </Card>
      </TouchableOpacity>
    </Link>
  )
}
//<ExternalLink href={organization.trackdaysRegistrationUrl || ''} asChild>

const styles = StyleSheet.create({
  cardTitle: {
    fontWeight: '600'
  },
  cardDetail: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  }
})
