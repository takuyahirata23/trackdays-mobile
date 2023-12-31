import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import Octicons from '@expo/vector-icons/Octicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import { Card } from './Card'
import { IconLabel } from './IconLabel'
import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'
import { formatDate } from '@functions/date'

import type { Trackday } from '@type/event'

type Props = {
  showDate?: boolean
} & Trackday

export function TrackdayLinkCard({
  id,
  track,
  price,
  organization,
  startDatetime,
  showDate = false
}: Props) {
  const {
    colors: { tertiary }
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
        <Card sidebarVariant="secondary" style={styles.card}>
          <Text style={styles.cardTitle}>{track.facility.name}</Text>
          <View style={styles.cardDetail}>
            <IconLabel
              variant="secondary"
              icon={<Octicons name="organization" size={18} color={tertiary} />}
              label={organization.name}
            />
            {price && (
              <IconLabel
                variant="secondary"
                icon={<FontAwesome name="dollar" size={18} color={tertiary} />}
                label={String(price)}
              />
            )}
            {showDate && (
              <IconLabel
                variant="secondary"
                icon={
                  <FontAwesome name="calendar" size={18} color={tertiary} />
                }
                label={formatDate(new Date(startDatetime))}
              />
            )}
          </View>
        </Card>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  card: {
    rowGap: 4
  },
  cardTitle: {
    fontWeight: '600'
  },
  cardDetail: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  }
})
