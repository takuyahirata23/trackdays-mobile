import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

import { useTheme } from '@hooks/useTheme'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'
import { Text } from './Text'

export function NoteEditCancel() {
  const { back } = useRouter()
  const { handleOnChange, fields } = React.useContext(TrackdayNoteFormContext)

  const onPress = () => {
    handleOnChange('noteEdit')(fields.note)
    back()
  }

  const {
    colors: { secondary }
  } = useTheme()

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, { color: secondary }]}>Cancel</Text>
    </TouchableOpacity>
  )
}

export function NoteEditDone() {
  const { handleOnChange, fields } = React.useContext(TrackdayNoteFormContext)
  const { back } = useRouter()

  const {
    colors: { accent, secondary }
  } = useTheme()

  const onPress = () => {
    handleOnChange('note')(fields.noteEdit)
    back()
  }

  const hasChanged = fields.note !== fields.noteEdit

  return (
    <TouchableOpacity onPress={onPress} disabled={!hasChanged}>
      <Text style={[styles.text, { color: hasChanged ? accent : secondary }]}>Done</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '600'
  }
})
