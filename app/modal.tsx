import React from 'react'
import { StyleSheet } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'

import { Container, KeyboardAvoidingView } from '@components'

import {
  DeleteTrackdayNoteConfirmation,
  DeleteMotorcycleConfirmation,
  MotorcycleRegistrationSelect
} from '@components/modalContents'

const titleMap: { [key: string]: string } = {
  deleteTrackdayConfirmation: 'Delete Trackday Note',
  deleteMotorcycleConfirmation: 'Delete Motorcycle',
  motorcycleRegistrationSelect: 'New Motorcycle'
}

const contentMap: { [key: string]: React.FC<any> } = {
  deleteTrackdayConfirmation: DeleteTrackdayNoteConfirmation,
  deleteMotorcycleConfirmation: DeleteMotorcycleConfirmation,
  motorcycleRegistrationSelect: MotorcycleRegistrationSelect
}

export default function ModalScreen() {
  const params = useLocalSearchParams()
  const { setOptions } = useNavigation()

  React.useEffect(() => {
    setOptions({
      title: titleMap[String(params.name)]
    })
  }, [params.name, setOptions])

  const Content = contentMap[String(params.name)]

  return (
    <KeyboardAvoidingView>
      <Container style={styles.container}>
        <Content {...params} />
      </Container>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {}
})
