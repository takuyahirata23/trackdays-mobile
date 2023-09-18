import React from 'react'
import { useQuery } from '@apollo/client'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

import { TRACKDAYS } from '@graphql/queries'
import { Container, Text, Card } from '@components'

export default function TrackdayIndex() {
  const { loading, data, error } = useQuery(TRACKDAYS)
  const Separator = () => <View style={styles.cardSeparator} />

  if (error) {
    return null
  }

  if (loading) {
    return (
      <Container>
        <Text>Loading</Text>
      </Container>
    )
  }

  return (
    <Container>
      <FlatList
        data={data.trackdays}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={Separator}
        renderItem={({ item: { id, date, track, motorcycle } }) => (
          <Link
            href={{
              pathname: '/trackday/[id]',
              params: { id }
            }}
            asChild
          >
            <TouchableOpacity>
              <Card>
                <View style={styles.cardFirstRow}>
                  <Text>{track.facility.name}</Text>
                  <Text style={styles.date}>{date}</Text>
                </View>
                <Text>
                  {motorcycle.model.make.name}: {motorcycle.model.name}
                </Text>
              </Card>
            </TouchableOpacity>
          </Link>
        )}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  cardSeparator: {
    marginTop: 16
  },
  card: {
    rowGap: 8
  },
  cardFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
    fontSize: 14
  }
})
