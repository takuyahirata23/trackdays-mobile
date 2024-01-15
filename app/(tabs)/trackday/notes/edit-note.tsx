import React from 'react'
import {  Platform } from 'react-native'

import { TrackdayNoteContext } from '@context/TrackdayNote'
import {
  Container,
  Field,
  KeyboardAvoidingView
} from '@components'

const isAndroid = Platform.OS === 'android'

export default function EditNote() {
  const {
    trackdayNote: { note },
    updateTrackdayNote
  } = React.useContext(TrackdayNoteContext)
  const [height, setHeight] = React.useState(0)

  return (
    <KeyboardAvoidingView>
      <Container>
        <Field
          label="Note"
          value={note}
          multiline
          onChangeText={updateTrackdayNote('note')}
          onContentSizeChange={e =>
            setHeight(e.nativeEvent.contentSize.height + (isAndroid ? 0 : 16))
          }
          inputStyle={{ height, minHeight: '30%'  }}
          style={{ flex: 1 }}
          textAlignVertical="top"
        />
      </Container>
    </KeyboardAvoidingView>
  )
}
