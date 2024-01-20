import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery , useMutation } from '@apollo/client'
import { isEmpty } from 'ramda'

import {
  MOTORCYCLES_QUERY
} from '@graphql/queries'
import { SAVE_TRACKDAY_NOTE } from 'graphql/mutations'
import { TRACKDAY_NOTE } from 'graphql/fragments'
import { TrackdayNoteFormContext } from '@context/TrackdayNoteForm'
import { useTheme } from '@hooks/useTheme'
import {
  Button,
  Card,
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

export default function CreateTrackdayNote() {
  const { date: dateParam } = useLocalSearchParams()
  const { goBack } = useNavigation()
  const { push } = useRouter()
  const motorcycleRes = useQuery(MOTORCYCLES_QUERY)

  const { fields, names, reset } = React.useContext(TrackdayNoteFormContext)
  const [
    { date, track, motorcycle, minutes, seconds, milliseconds },
    setFields
  ] = React.useState({
    date: dateParam as string,
    track: '',
    motorcycle: '',
    minutes: '',
    seconds: '',
    milliseconds: ''
  })

  const [formError, setFormError] = React.useState<TrackdayNoteFormErrors>({
    isValid: false,
    date: '',
    track: '',
    motorcycle: '',
    minutes: '',
    seconds: '',
    milliseconds: ''
  })

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
      reset()
      goBack()
    }
  })

  const {
    colors: { error }
  } = useTheme()

  const handleOnChange = (field: string) => (value: string) => {
    if (field === 'facility') {
      setFields(prev => ({ ...prev, [field]: value, track: '' }))
    } else {
      setFields(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = () =>
    setFormError(
      validateTrackdayNote({
        date,
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
            note: fields.note
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
              <Card>
                <Text>Date: {date}</Text>
              </Card>
              <View style={styles.laptimeWrapper}>
                <View style={styles.lapTimeFieldWrapper}>
                  <Field
                    label="Minute"
                    value={minutes}
                    style={styles.lapTimeField}
                    onChangeText={handleOnChange('minutes')}
                    keyboardType="numeric"
                    placeholder="00"
                    error={formError.minutes}
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
                    error={formError.seconds}
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
                    error={formError.milliseconds}
                  />
                </View>
              </View>
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
                <Card>
                  <Text>Facility: {names.facility}</Text>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!fields.facility}
                onPress={() =>
                  push({
                    pathname: '/modal',
                    params: {
                      name: 'trackdayNoteSelect',
                      currentStep: 'track',
                      facilityId: fields.facility
                    }
                  })
                }
              >
                <Card>
                  <Text>Track: {names.track}</Text>
                </Card>
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
                <Card>
                  <Text>
                    Motorcycle:{' '}
                    {names.motorcycle}
                  </Text>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  push('/trackday/notes/edit-note')
                }}
              >
                <Card>
                  <Text>{fields.note ? fields.note : 'Note:'}</Text>
                </Card>
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
  btnWrapper: {
    rowGap: 16
  }
})
