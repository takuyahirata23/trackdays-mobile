import React from 'react'
import { StyleSheet } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'

import { Card } from './Card'
import { Text } from './Text'

type Props = {}

export function TrackdayAddCard({}: Props) {
  return (
    <Card style={styles.card}>
      <AntDesign name="pluscircleo" size={20} />
      <Text>Add your trackday record</Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    columnGap: 8
  }
})
