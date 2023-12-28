import React from 'react'
import { useQuery } from '@apollo/client'
import { useRouter, Link } from 'expo-router'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { isEmpty } from 'ramda'
import { Ionicons } from '@expo/vector-icons'

import { Text } from './Text'
import { Card } from './Card'
import { LabelView } from './LabelView'
import { MOTORCYCLES_QUERY } from '@graphql/queries'
import { useTheme } from '@hooks/useTheme'

import type { Motorcycle } from '@type/vehicle'

export function Motorcycles() {
  const { loading, data, error } = useQuery(MOTORCYCLES_QUERY)
  const { push } = useRouter()
  const {
    colors: { primary }
  } = useTheme()

  if (loading || error) {
    return null
  }

  const handleOnPress = () => push('/profile/motorcycles/register-motorcycle')

  return isEmpty(data.motorcycles) ? null : (
    <View style={styles.wrapper}>
      <View style={styles.titleWrapper}>
        <Text style={styles.sectionHeading}>Motorcycles</Text>
        <TouchableOpacity onPress={handleOnPress}>
          <Ionicons name="add" size={28} color={primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        {data.motorcycles.map(({ id, year, model }: Motorcycle) => (
          <Link
            href={{ pathname: '/profile/motorcycles/[id]', params: { id } }}
            key={id}
            asChild
          >
            <TouchableOpacity>
              <Card key={id}>
                <LabelView
                  label={model.make.name}
                  value={`${model.name} (${year})`}
                />
              </Card>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    rowGap: 8
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '500'
  }
})
