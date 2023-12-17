import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'

import { Card } from './Card'
import { IconLabel } from './IconLabel'
import { Text } from './Text'
import { formatLapTime } from '@functions/lapTimeConverters'
import { useTheme } from '@hooks/useTheme'

import type { TrackdayNote } from '@type/event'

type Props = {
  showSubtitle?: boolean
} & TrackdayNote

export function TrackdayNoteLinkCard({
  id,
  track,
  lapTime,
  motorcycle,
  showSubtitle
}: Props) {
  const {
    colors: { accent }
  } = useTheme()

  return (
    <Link
      href={{
        pathname: '/trackday/notes/[id]',
        params: { id }
      }}
      asChild
    >
      <TouchableOpacity>
        <Card style={styles.card} sidebarVariant="primary">
          <Text style={styles.cardTitle}>{track.facility.name}</Text>
          {showSubtitle && (
            <Text style={styles.cardSubTitle}>{track.name}</Text>
          )}
          <View style={styles.cardDetail}>
            <IconLabel
              icon={
                <MaterialCommunity name="motorbike" size={20} color={accent} />
              }
              label={motorcycle.model.name}
              variant="secondary"
            />
            <IconLabel
              icon={<MaterialCommunity name="timer" size={20} color={accent} />}
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
  card: {
    rowGap: 8
  },
  cardTitle: {
    fontWeight: '600'
  },
  cardSubTitle: {
    fontSize: 14
  },
  cardDetail: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center'
  }
})
