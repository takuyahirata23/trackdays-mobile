import React from 'react'
import { useQuery } from '@apollo/client'
import {  useRouter } from 'expo-router'
import Toast from 'toastify-react-native'

import {
  FACILITIES_QUERY,
} from '@graphql/queries'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'


import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from './Text'

export function FacilitySelect() {
  const { loading, error, data } = useQuery(FACILITIES_QUERY)
  const { handleOnChange } = React.useContext(TrackdayNoteFormContext) 
  const { back } = useRouter()


  if(loading) {
    <View>
      <Text>Loading...</Text>
    </View>
  }

  if(error) {
    return Toast.error('Error. Please try it later', 'bottom')
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('facility')(id, name)
    back()
  }

  return (
    <FlatList
      data={data.facilities}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => onPress(item.id, item.name)}
        >
          <Text style={styles.optionText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 20
  },
  header: {
    fontWeight: '600',
    fontSize: 18
  },
  optionContainer: {
    paddingVertical: 16
  },
  optionText: {
    fontSize: 18
  }
})
