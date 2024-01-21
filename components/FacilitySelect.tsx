import React from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'expo-router'
import Toast from 'toastify-react-native'

import { FACILITIES_QUERY } from '@graphql/queries'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'

import { FlatList, StyleSheet } from 'react-native'

import { ActivityIndicator } from './ActivityIndicator'
import { RadioOption } from './RadioOption'

export function FacilitySelect() {
  const { loading, error, data } = useQuery(FACILITIES_QUERY)
  const { handleOnChange, fields } = React.useContext(TrackdayNoteFormContext)
  const { back } = useRouter()

  if (loading) {
    return <ActivityIndicator />
  }

  if (error) {
    Toast.error('Error. Please try it later', 'bottom')
    return null
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('facility')(id, name)
    back()
  }

  return (
    <FlatList
      data={data.facilities}
      renderItem={({ item }) => (
        <RadioOption
          onPress={() => onPress(item.id, item.name)}
          label={item.name}
          isSelected={fields.facility === item.id}
          style={styles.radioOption}
        />
      )}
      keyExtractor={item => item.id}
    />
  )
}

const styles = StyleSheet.create({
  radioOption: {
    marginBottom: 12
  }
})
