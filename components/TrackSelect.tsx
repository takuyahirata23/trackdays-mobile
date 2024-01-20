import React from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'expo-router'
import Toast from 'toastify-react-native'

import { TRACKS_QUERY } from '@graphql/queries'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'

import { FlatList, View, StyleSheet } from 'react-native'

import { RadioOption } from './RadioOption'
import { Text } from './Text'

export function TrackSelect() {
  const { handleOnChange, fields } = React.useContext(TrackdayNoteFormContext)
  const { loading, error, data } = useQuery(TRACKS_QUERY, {
    variables: { facilityId: fields.facility }
  })
  const { back } = useRouter()

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return Toast.error('Error. Please try it later', 'bottom')
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('track')(id, name)
    back()
  }

  return (
    <FlatList
      data={data.tracks}
      renderItem={({ item }) => (
        <RadioOption
          onPress={() => onPress(item.id, item.name)}
          label={item.name}
          isSelected={fields.track === item.id}
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