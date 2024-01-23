import React from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'expo-router'
import Toast from 'toastify-react-native'

import { MOTORCYCLES_QUERY } from '@graphql/queries'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'

import { FlatList } from 'react-native'

import { ActivityIndicator } from './ActivityIndicator'
import { RadioOption } from './RadioOption'

export function MotorcycleSelect() {
  const { handleOnChange, fields } = React.useContext(TrackdayNoteFormContext)
  const { loading, error, data } = useQuery(MOTORCYCLES_QUERY)
  const { back } = useRouter()

  if (loading) {
    return <ActivityIndicator />
  }

  if (error) {
    Toast.error('Error. Please try it later', 'bottom')
    return null
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('motorcycle')(id, name)
    back()
  }

  return (
    <FlatList
      data={data.motorcycles}
      renderItem={({ item, index }) => (
        <RadioOption
          onPress={() =>
            onPress(item.id, `${item.model.make.name} ${item.model.name}`)
          }
          label={`${item.model.make.name} ${item.model.name}`}
          isSelected={fields.motorcycle === item.id}
          style={{
            paddingHorizontal: 16,
            paddingBottom: 8,
            paddingTop: index ? 8 : 16
          }}
        />
      )}
      keyExtractor={item => item.id}
    />
  )
}
