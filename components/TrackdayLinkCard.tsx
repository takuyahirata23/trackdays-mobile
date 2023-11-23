import React from 'react'
import { StyleSheet, View } from 'react-native'
import Octicons from '@expo/vector-icons/Octicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import { Card } from './Card'
import { IconLabel } from './IconLabel'
import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'

import type { Trackday } from '@type/event'

export function TrackdayLinkCard({ track, price, organization }: Trackday) {
  const {
    colors: { primary }
  } = useTheme()

  return (
    <Card>
      <Text style={styles.cardTitle}>{track.facility.name}</Text>
      <View style={styles.cardDetail}>
        <Card variant="secondary">
          <IconLabel
            icon={<Octicons name="organization" size={24} color={primary} />}
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
  )
}

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
