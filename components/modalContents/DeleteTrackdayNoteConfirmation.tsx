import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useMutation } from '@apollo/client'
import { useNavigation, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { Feather } from '@expo/vector-icons'

import { DELETE_TRACKDAY_NOTE } from '@graphql/mutations'
import { Text, Button } from '@components'
import { useTheme } from '@hooks/useTheme'

export function DeleteTrackdayButton() {
  const { id } = useLocalSearchParams()
  const { push } = useRouter()
  const { colors: { primary } } = useTheme()
  const openModal = () =>
    push({
      pathname: '/modal',
      params: {
        name: 'deleteTrackdayConfirmation',
        id
      }
    })

  return (
    <TouchableOpacity onPress={openModal} style={styles.iconPadding} >
      <Feather name="trash-2" size={20} color={primary}/>
    </TouchableOpacity>
  )
}

export function DeleteTrackdayNoteConfirmation({ id }: { id: string }) {
  const { goBack } = useNavigation()
  const { push } = useRouter()
  const [deleteTrackdayNote] = useMutation(DELETE_TRACKDAY_NOTE, {
    update(cache, { data: { deleteTrackdayNote } }) {
      // Remove delete trackday from cache
      cache.evict({ id: cache.identify(deleteTrackdayNote) })
      // Remove all of the unreachable cache
      cache.gc()
    },
    onError(e) {
      console.log(e)
    },
    onCompleted() {
      push('/trackday')
    }
  })

  const handleDelete = () =>
    deleteTrackdayNote({
      variables: {
        id
      }
    })

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Are you sure you want to delete this trackday note?
      </Text>
      <View style={styles.buttonWrapper}>
        <Button onPress={goBack}>Cancel</Button>
        <Button variant="secondary" onPress={handleDelete}>
          Delete
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 36
  },
  message: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  buttonWrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
    rowGap: 20
  },
  iconPadding: {
    padding: 4
  }
})
