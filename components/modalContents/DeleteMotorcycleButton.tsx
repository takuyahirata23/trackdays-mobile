import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useMutation } from '@apollo/client'
import { useNavigation, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { Toast } from 'toastify-react-native'

import { ARCHIVE_MOTORCYCLE } from '@graphql/mutations'
import { Text, Button } from '@components'
import { useTheme } from '@hooks/useTheme'

export function DeleteMotorcycleButton() {
  const { id } = useLocalSearchParams()
  const { push } = useRouter()

  const {
    colors: { primary }
  } = useTheme()
  const openModal = () =>
    push({
      pathname: '/modal',
      params: {
        name: 'deleteMotorcycleConfirmation',
        id
      }
    })

  return (
    <TouchableOpacity onPress={openModal} style={styles.iconPadding}>
      <Feather name="trash-2" size={20} color={primary} />
    </TouchableOpacity>
  )
}

export function DeleteMotorcycleConfirmation({ id }: { id: string }) {
  const { goBack } = useNavigation()
  const { push } = useRouter()
  const [archiveMotorcycle] = useMutation(ARCHIVE_MOTORCYCLE, {
    update(cache) {
      cache.modify({
        fields: {
          motorcycles(existingMotorcycleRefs, { readField }) {
            return existingMotorcycleRefs.filter((ref: any) => {
              return id !== readField('id', ref)
            })
          }
        }
      })
    },
    onError() {
      Toast.error('There was a problem deleting motorcycle', 'bottom')
    },
    onCompleted() {
      push('/profile')
    }
  })

  const handleDelete = () =>
    archiveMotorcycle({
      variables: {
        id
      }
    })
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Are you sure you want to delete this motorcycle?
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
