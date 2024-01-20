import React from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useQuery, useMutation } from '@apollo/client'
import Toast from 'toastify-react-native'

import { TRACKDAY_NOTE } from '@graphql/queries'
import { UPDATE_TRACKDAY_NOTE } from '@graphql/mutations'
import { validateTrackdayNote } from '@functions/validations'
import { lapTimeToMilliseconds } from '@functions/lapTimeConverters'
import {
  Button,
  Field,
  Text,
  Container,
  KeyboardAvoidingView
} from '@components'
import { useTheme } from 'hooks/useTheme'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'

export type TrackdayNoteFormErrors = {
  isValid: boolean
  date?: string
  track?: string
  motorcycle?: string
  minutes?: string
  seconds?: string
  milliseconds?: string
}

const formErrorsInitialValue = {
  isValid: false,
  track: '',
  motorcycle: '',
  minutes: '',
  seconds: '',
  milliseconds: ''
}

export default function Update() {
  const { push } = useRouter()
  const { goBack } = useNavigation()
  const { id } = useLocalSearchParams()
  const {
    data: { trackdayNote }
  } = useQuery(TRACKDAY_NOTE, {
    variables: {
      id
    },
    fetchPolicy: 'cache-only'
  })

  const {
    fields: {
      facility,
      track,
      motorcycle,
      minutes,
      seconds,
      milliseconds,
      note
    },
    handleOnChange,
    sync,
    names,
    reset
  } = React.useContext(TrackdayNoteFormContext)

  const [formError, setFormError] = React.useState<TrackdayNoteFormErrors>(
    formErrorsInitialValue
  )

  const [updateTrackdayNote, { loading }] = useMutation(UPDATE_TRACKDAY_NOTE, {
    onError() {
      Toast.error('Error. Please try it later', 'bottom')
    },
    onCompleted() {
      setFormError(formErrorsInitialValue)
      reset()
      goBack()
    }
  })
  const {
    colors: { error, bgSecondary }
  } = useTheme()

  const laptimeError = Boolean(
    formError.minutes || formError.seconds || formError.milliseconds
  )

  const handleSubmit = () =>
    setFormError(
      validateTrackdayNote({
        track,
        motorcycle,
        minutes,
        seconds,
        milliseconds
      })
    )

  React.useEffect(() => {
    if (trackdayNote) {
      sync(trackdayNote)
    }
  }, [trackdayNote])

  React.useEffect(() => {
    if (formError.isValid) {
      updateTrackdayNote({
        variables: {
          updateTrackdayNoteInput: {
            id,
            lapTime: lapTimeToMilliseconds({ minutes, seconds, milliseconds }),
            motorcycleId: motorcycle,
            trackId: track,
            note
          }
        }
      })
    }
  }, [track, motorcycle, minutes, seconds, milliseconds, formError])

  return (
    <Container>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <Field
            label="Date"
            value={trackdayNote.date}
            editable={false}
            pointerEvents="none"
          />
          <View style={styles.laptimeWrapper}>
            <View style={styles.lapTimeFieldWrapper}>
              <Field
                label="Minute"
                value={minutes}
                style={styles.lapTimeField}
                onChangeText={handleOnChange('minutes')}
                keyboardType="numeric"
                placeholder="00"
              />
              <Text style={styles.laptimeSemicolon}>:</Text>
            </View>
            <View style={styles.lapTimeFieldWrapper}>
              <Field
                label="Seconds"
                value={seconds}
                onChangeText={handleOnChange('seconds')}
                style={styles.lapTimeField}
                keyboardType="numeric"
                placeholder="00"
              />
              <Text style={styles.laptimeSemicolon}>:</Text>
            </View>
            <View style={styles.lapTimeFieldWrapper}>
              <Field
                label="Miliseconds"
                value={milliseconds}
                onChangeText={handleOnChange('milliseconds')}
                style={styles.lapTimeField}
                keyboardType="numeric"
                placeholder="000"
                returnKeyType="done"
              />
            </View>
          </View>
          {laptimeError && (
            <View>
              {formError.minutes && (
                <Text style={{ color: error, fontSize: 14 }}>
                  {formError.minutes}
                </Text>
              )}
              {formError.seconds && (
                <Text style={{ color: error, fontSize: 14 }}>
                  {formError.seconds}
                </Text>
              )}
              {formError.milliseconds && (
                <Text style={{ color: error, fontSize: 14 }}>
                  {formError.milliseconds}
                </Text>
              )}
            </View>
          )}
          <TouchableOpacity
            onPress={() =>
              push({
                pathname: '/modal',
                params: {
                  name: 'trackdayNoteSelect',
                  currentStep: 'facility'
                }
              })
            }
          >
            <Field
              editable={false}
              value={names.facility}
              label="Facility"
              pointerEvents="none"
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!facility}
            onPress={() =>
              push({
                pathname: '/modal',
                params: {
                  name: 'trackdayNoteSelect',
                  currentStep: 'track',
                  facilityId: facility
                }
              })
            }
          >
            <Field
              editable={false}
              value={names.track}
              label="Track"
              pointerEvents="none"
              error={formError.track}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              push({
                pathname: '/modal',
                params: {
                  name: 'trackdayNoteSelect',
                  currentStep: 'motorcycle'
                }
              })
            }
          >
            <Field
              editable={false}
              value={names.motorcycle}
              label="Motorcycle"
              pointerEvents="none"
              error={formError.motorcycle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              push('/trackday/notes/edit-note')
            }}
          >
            <View
              style={{
                backgroundColor: bgSecondary,
                paddingVertical: 16,
                paddingHorizontal: 8,
                borderRadius: 4
              }}
            >
              <Text>{note || 'Note:'}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.btnWrapper}>
            <Button onPress={handleSubmit} disabled={loading}>Save</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    flex: 1,
    paddingBottom: 16
  },
  laptimeWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  lapTimeFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  lapTimeField: {
    flex: 1
  },
  laptimeSemicolon: {
    marginTop: 16,
    marginHorizontal: 8
  },
  btnWrapper: {
    marginTop: 'auto',
    rowGap: 16
  }
})
