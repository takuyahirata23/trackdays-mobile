import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation } from '@apollo/client'
import { isEmpty } from 'ramda'

import { MOTORCYCLES_QUERY } from '@graphql/queries'
import { SAVE_TRACKDAY_NOTE } from 'graphql/mutations'
import { TRACKDAY_NOTE } from 'graphql/fragments'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'
import { useTheme } from '@hooks/useTheme'
import {
  Button,
  Field,
  Text,
  Container,
  KeyboardAvoidingView,
  NoMotorcycleRegisteredError
} from '@components'
import { lapTimeToMilliseconds } from '@functions/lapTimeConverters'
import { validateTrackdayNote } from '@functions/validations'

export type TrackdayNoteFormErrors = {
  isValid: boolean
  date?: string
  track?: string
  motorcycle?: string
  minutes?: string
  seconds?: string
  milliseconds?: string
}

const formErrorInitialValues =  {
    isValid: false,
    track: '',
    motorcycle: '',
    minutes: '',
    seconds: '',
    milliseconds: ''
}

export default function CreateTrackdayNote() {
  const { date } = useLocalSearchParams()
  const { goBack } = useNavigation()
  const { push } = useRouter()
  const motorcycleRes = useQuery(MOTORCYCLES_QUERY)

  const {
    fields: {
      note,
      motorcycle,
      facility,
      track,
      minutes,
      seconds,
      milliseconds
    },
    handleOnChange,
    names,
    reset
  } = React.useContext(TrackdayNoteFormContext)

  const [formError, setFormError] = React.useState<TrackdayNoteFormErrors>(formErrorInitialValues)

  const [saveTrackdayNote] = useMutation(SAVE_TRACKDAY_NOTE, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          trackdayNotes(ref = []) {
            const newTrackdayRef = cache.writeFragment({
              data: data.saveTrackdayNote,
              fragment: TRACKDAY_NOTE
            })
            return [newTrackdayRef, ...ref]
          },
          trackdayNotesByMonth(ref = []) {
            const newTrackdayRef = cache.writeFragment({
              data: data.saveTrackdayNote,
              fragment: TRACKDAY_NOTE
            })
            return [newTrackdayRef, ...ref]
          }
        }
      })
    },
    onError(e) {
      console.log('error', e)
    },
    onCompleted() {
      setFormError(formErrorInitialValues)
      reset()
      goBack()
    }
  })

  const {
    colors: { error, bgSecondary }
  } = useTheme()

  const handleSubmit = () =>
    setFormError(
      validateTrackdayNote({
        date: date as string,
        track,
        motorcycle,
        minutes,
        seconds,
        milliseconds
      })
    )

  React.useEffect(() => {
    if (formError.isValid) {
      saveTrackdayNote({
        variables: {
          saveTrackdayNoteInput: {
            date,
            lapTime: lapTimeToMilliseconds({ minutes, seconds, milliseconds }),
            motorcycleId: motorcycle,
            trackId: track,
            note: note
          }
        }
      })
    }
  }, [date, track, motorcycle, minutes, seconds, milliseconds, formError])

  const laptimeError = Boolean(
    formError.minutes || formError.seconds || formError.milliseconds
  )

  return motorcycleRes.called &&
    !motorcycleRes.loading &&
    isEmpty(motorcycleRes.data.motorcycles) ? (
    <NoMotorcycleRegisteredError />
  ) : (
    <KeyboardAvoidingView>
      <Container style={{ paddingTop: 0, paddingHorizontal: 0 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.container}>
              <Field
                label="Date"
                value={date as string}
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
                  pointerEvents="none"
                  value={names.facility}
                  editable={false}
                  label="Facility"
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
                  value={names.track}
                  label="Track"
                  editable={false}
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
                  label="Motorcycle"
                  value={names.motorcycle}
                  editable={false}
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
                <Button onPress={handleSubmit}>Save</Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 20
  },
  container: {
    rowGap: 16,
    flex: 1
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
  errorMessage: {
    fontSize: 14
  },
  btnWrapper: {
    rowGap: 16
  }
})
