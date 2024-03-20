import React from 'react'
import { StyleSheet, View } from 'react-native'
import { isEmpty } from 'ramda'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'
import { useTheme } from '@hooks/useTheme'

import { formatLapTime } from '@functions/lapTimeConverters'
import { Card } from './Card'
import { IconLabel } from './IconLabel'
import { Text } from './Text'

import type { Group } from '@type/accounts'

type AverageLapTime = {
  group: Group
  averageLapTime: number
}

type Props = {
  averageLapTimes: AverageLapTime[]
}

export function AverageLapTimes({ averageLapTimes }: Props) {
  const {
    colors: { accent }
  } = useTheme()
  return isEmpty(averageLapTimes) ? null : (
    <Card style={styles.container}>
      <Text style={styles.heading}>Average lap times for group</Text>
      <View
        style={[
          styles.flex,
          averageLapTimes.length === 3
            ? styles.maxContainer
            : styles.nonMaxContainer
        ]}
      >
        {averageLapTimes.map(({ group, averageLapTime }: AverageLapTime) => (
          <View key={group.id} style={styles.lapTimeWrapper}>
            <Text>{group.name}</Text>
            <IconLabel
              icon={<MaterialCommunity name="timer" size={16} color={accent} />}
              cardStyle={{ columnGap: 4 }}
              label={formatLapTime(averageLapTime)}
              variant="secondary"
              textStyle={styles.small}
            />
          </View>
        ))}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 8
  },
  heading: {
    fontWeight: '500',
  },
  flex: {
    flexDirection: 'row'
  },
  nonMaxContainer: {
    columnGap: 16
  },
  maxContainer: {
    justifyContent: 'space-between'
  },
  lapTimeWrapper: {
    flexBasis: '30%'
  },
  small: {
    fontSize: 13
  }
})
