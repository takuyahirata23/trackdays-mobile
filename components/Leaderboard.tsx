import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { isEmpty } from 'ramda'
import { Feather } from '@expo/vector-icons'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'

import { useTheme } from '@hooks/useTheme'
import { Card } from './Card'
import { Text } from './Text'
import { IconLabel } from './IconLabel'
import { formatLapTime } from '@functions/lapTimeConverters'

import type { User } from '@type/accounts'
import type { Motorcycle } from '@type/vehicle'

type LeaderboardItem = {
  user: User
  motorcycle: Motorcycle
  time: number
}

export function Leaderboard({ trackdayNotes }: any) {
  const {
    colors: { bgSecondary, bgPrimary, accent }
  } = useTheme()

  return isEmpty(trackdayNotes) ? null : (
    <Card style={styles.card}>
      {trackdayNotes.map(({ user, motorcycle, time }: LeaderboardItem, i: number) => (
        <View
          key={user.id}
          style={[
            styles.riderWrapper,
            {
              borderTopWidth: 1,
              borderColor: i ? bgPrimary : 'transparent',
              marginTop: i ? 8 : 0,
              paddingTop: i ? 8 : 0
            }
          ]}
        >
          <View style={{ borderRadius: 25, overflow: 'hidden' }}>
            {user.imageUrl ? (
              <Image
                source={user.imageUrl}
                transition={300}
                style={styles.profileImage}
              />
            ) : (
              <Feather size={50} name="user" color={bgSecondary} />
            )}
          </View>
          <View style={{ flex: 1, rowGap: 2 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.small}>{motorcycle.model.name}</Text>
          </View>
          <View>
            <IconLabel
              icon={<MaterialCommunity name="timer" size={16} color={accent} />}
              cardStyle={{ columnGap: 4 }}
              label={formatLapTime(time)}
              variant="secondary"
              textStyle={styles.small}
            />
          </View>
        </View>
      ))}
    </Card>
  )
}
const styles = StyleSheet.create({
  card: {
    rowGap: 8
  },
  riderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  },
  profileImage: {
    height: 50,
    width: 50
  },
  name: {
    fontSize: 15
  },
  small: {
    fontSize: 13
  }
})
