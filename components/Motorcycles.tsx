import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, View } from 'react-native'
import { isEmpty } from 'ramda'

import { Text, Card, LabelView } from '@components'
import { MOTORCYCLES_QUERY } from '@graphql/queries'

import type { Motorcycle } from '@type/vehicle'

export function Motorcycles() {
  const { loading, data, error } = useQuery(MOTORCYCLES_QUERY)

  if (loading || error) {
    return null
  }

  return isEmpty(data.motorcycles) ? null : (
    <View style={styles.wrapper}>
      <Text style={styles.sectionHeading}>Motorcycles</Text>
      <View style={styles.wrapper}>
        {data.motorcycles.map(({ id, year, model }: Motorcycle) => (
          <Card key={id}>
            <LabelView
              label={model.make.name}
              value={`${model.name} (${year})`}
            />
          </Card>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    rowGap: 8
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '500'
  }
})
