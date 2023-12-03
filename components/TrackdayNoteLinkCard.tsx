import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

import { Card } from './Card'
import { IconLabel } from './IconLabel'
import { Text } from './Text'
import { formatLapTime } from '@functions/lapTimeConverters'

import type { TrackdayNote } from '@type/event'

export function TrackdayNoteLinkCard({
  id,
  track,
  lapTime,
  motorcycle
}: TrackdayNote) {
  return (
    <Link
      href={{
        pathname: '/trackday/notes/[id]',
        params: { id }
      }}
      asChild
    >
      <TouchableOpacity>
        <Card>
          <Text style={styles.cardTitle}>{track.facility.name}</Text>
          <View style={styles.cardDetail}>
            <IconLabel
              name="motorbike"
              label={motorcycle.model.name}
              variant="secondary"
            />
            <IconLabel
              name="timer"
              label={formatLapTime(Number(lapTime))}
              variant="secondary"
            />
          </View>
        </Card>
      </TouchableOpacity>
    </Link>
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
