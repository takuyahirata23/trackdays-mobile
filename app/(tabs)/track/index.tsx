import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useQuery } from '@apollo/client'
import { Link } from 'expo-router'

import { Container, Card, Text } from '@components'
import { FACILITIES_QUERY } from '@graphql/queries'

import type { Facility } from '@type/park'

export default function Leaderboard() {
  const { loading, data, error } = useQuery(FACILITIES_QUERY)

  if (loading) {
    return null
  }

  if (error) {
    return null
  }

  return (
    <Container style={styles.container}>
      {data.facilities?.map(({ id, name, description }: Facility) => (
        <Link
          href={{ pathname: '/track/[id]', params: { id } }}
          key={id}
          asChild
        >
          <TouchableOpacity>
            <Card key={id} style={styles.card}>
              <Text style={styles.facility}>{name}</Text>
              <Text
                style={styles.description}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {description}
              </Text>
            </Card>
          </TouchableOpacity>
        </Link>
      ))}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16
  },
  card: {
    rowGap: 8
  },
  facility: {
    fontSize: 20,
    fontWeight: '500'
  },
  description: {
    fontSize: 14
  },
  linkText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18
  }
})
