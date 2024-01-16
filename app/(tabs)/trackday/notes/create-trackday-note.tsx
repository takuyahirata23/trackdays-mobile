import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Picker } from '@react-native-picker/picker'
import { isEmpty } from 'ramda'
import BottomSheetType from '@gorhom/bottom-sheet'

import {
  FACILITIES_QUERY,
  TRACKS_QUERY,
  MOTORCYCLES_QUERY
} from '@graphql/queries'
import { SAVE_TRACKDAY_NOTE } from 'graphql/mutations'
import { TRACKDAY_NOTE } from 'graphql/fragments'
import { TrackdayNoteContext } from '@context/TrackdayNote'
import { useTheme } from '@hooks/useTheme'
import {
  Button,
  BottomSheet,
  Card,
  Field,
  Text,
  Container,
  BottomSheetHandle,
  KeyboardAvoidingView,
  NoMotorcycleRegisteredError
} from '@components'
import { lapTimeToMilliseconds } from '@functions/lapTimeConverters'
import { validateTrackdayNote } from '@functions/validations'

import type { Motorcycle } from '@type/vehicle'
import type { Facility, Track } from '@type/park'

enum SaveTrackdaySteps {
  Facility,
  Track,
  Motorcycle,
  Laptime,
  Note,
  Submit
}

export type TrackdayNoteFormErrors = {
  isValid: boolean
  date?: string
  track?: string
  motorcycle?: string
  minutes?: string
  seconds?: string
  milliseconds?: string
}

const goBackToPreviousStep = (prev: SaveTrackdaySteps) => {
  switch (prev) {
    case SaveTrackdaySteps.Track:
      return SaveTrackdaySteps.Facility

    case SaveTrackdaySteps.Motorcycle:
      return SaveTrackdaySteps.Track

    case SaveTrackdaySteps.Laptime:
      return SaveTrackdaySteps.Motorcycle

    default:
      return SaveTrackdaySteps.Facility
  }
}

export default function CreateTrackdayNote() {
  const bottomSheetRef = React.useRef<BottomSheetType>(null)
  const { date: dateParam } = useLocalSearchParams()
  const { goBack } = useNavigation()
  const { push } = useRouter()
  const motorcycleRes = useQuery(MOTORCYCLES_QUERY)
  const facilityRes = useQuery(FACILITIES_QUERY)
  const [currentStep, setCurrentStep] = React.useState(
    SaveTrackdaySteps.Facility
  )

  const {
    trackdayNote: { note },
    reset
  } = React.useContext(TrackdayNoteContext)
  const [
    { date, facility, track, motorcycle, minutes, seconds, milliseconds },
    setFields
  ] = React.useState({
    date: dateParam as string,
    facility: '',
    track: '',
    motorcycle: '',
    minutes: '',
    seconds: '',
    milliseconds: ''
  })
  const [getTracks, tracksRes] = useLazyQuery(TRACKS_QUERY, {
    variables: {
      facilityId: facility
    }
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

  React.useEffect(() => {
    if (facility) {
      getTracks()
    }
  }, [facility])

  const handleOnChange = (field: string) => (value: string) => {
    if (field === 'facility') {
      setFields(prev => ({ ...prev, [field]: value, track: '' }))
    } else {
      setFields(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleCurrentStepChange = (step: SaveTrackdaySteps) => () => {
    if (SaveTrackdaySteps.Track === step && !facility) {
      setCurrentStep(SaveTrackdaySteps.Facility)
    } else {
      setCurrentStep(step)
    }
    bottomSheetRef.current?.expand()
  }

  const onPressHandlers = () => {
    switch (currentStep) {
      case SaveTrackdaySteps.Facility:
        return () => {
          if (!facility) {
            handleOnChange('facility')(facilityRes.data.facilities[0].id)
          }
          setCurrentStep(SaveTrackdaySteps.Track)
        }
      case SaveTrackdaySteps.Track:
        return () => {
          if (!track) {
            handleOnChange('track')(tracksRes.data.tracks[0].id)
          }
          setCurrentStep(SaveTrackdaySteps.Motorcycle)
        }
      case SaveTrackdaySteps.Motorcycle:
        return () => {
          if (!motorcycle) {
            handleOnChange('motorcycle')(motorcycleRes.data.motorcycles[0].id)
          }
          setCurrentStep(SaveTrackdaySteps.Laptime)
          bottomSheetRef.current?.close()
        }
    }
  }

  // TODO: refactor to make them reusable
  const getName = (data: any) => (id: string) =>
    data.find((x: any) => x.id === id)?.name || ''

  const getMotorcycleName = (data: any) => (id: string) =>
    data.find((x: any) => x.id === id)?.model.name || ''

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
              <Card>
                <Text>Date: {date}</Text>
              </Card>
              <TouchableOpacity
                onPress={handleCurrentStepChange(SaveTrackdaySteps.Facility)}
              >
                <Card>
                  <Text>
                    Facility:{' '}
                    {getName(facilityRes.data?.facilities || [])(facility)}
                  </Text>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCurrentStepChange(SaveTrackdaySteps.Track)}
              >
                <Card>
                  <Text>
                    Track: {getName(tracksRes.data?.tracks || [])(track)}
                  </Text>
                </Card>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCurrentStepChange(SaveTrackdaySteps.Motorcycle)}
              >
                <Card>
                  <Text>
                    Motorcycle:{' '}
                    {getMotorcycleName(motorcycleRes.data?.motorcycles || [])(
                      motorcycle
                    )}
                  </Text>
                </Card>
              </TouchableOpacity>
              {currentStep === SaveTrackdaySteps.Laptime ? (
                <Card
                  style={{
                    borderColor: error,
                    borderWidth: laptimeError ? 1 : 0
                  }}
                >
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
                        onEndEditing={() => {
                          setCurrentStep(SaveTrackdaySteps.Note)
                        }}
                      />
                    </View>
                  </View>
                </Card>
              ) : (
                <TouchableOpacity
                  onPress={() => setCurrentStep(SaveTrackdaySteps.Laptime)}
                >
                  <Card
                    style={{
                      borderColor: error,
                      borderWidth: laptimeError ? 1 : 0
                    }}
                  >
                    <Text>
                      Best lap time: {minutes || '00'}:{seconds || '00'}:
                      {milliseconds || '000'}
                    </Text>
                  </Card>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current?.close()
                  setCurrentStep(SaveTrackdaySteps.Note)
                  push('/trackday/notes/edit-note')
                }}
              >
                <Card>
                  <Text>{note ? note : 'Note:'}</Text>
                </Card>
              </TouchableOpacity>
              <View style={styles.btnWrapper}>
                <Button onPress={handleSubmit}>Save</Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        enablePanDownToClose
        handleComponent={() => (
          <BottomSheetHandle
            onPressRight={onPressHandlers() as () => void}
            rightText="Next"
            onPressLeft={() => setCurrentStep(goBackToPreviousStep)}
            leftText={
              currentStep !== SaveTrackdaySteps.Facility ? 'Back' : undefined
            }
          />
        )}
      >
        {currentStep === SaveTrackdaySteps.Facility && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={facility}
              onValueChange={handleOnChange('facility')}
            >
              {facilityRes?.data?.facilities.map((m: Facility) => (
                <Picker.Item value={m.id} label={m.name} key={m.id} />
              ))}
            </Picker>
          </View>
        )}
        {currentStep === SaveTrackdaySteps.Track &&
          facility &&
          tracksRes.data && (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={track}
                onValueChange={handleOnChange('track')}
              >
                {tracksRes?.data?.tracks?.map((m: Track) => (
                  <Picker.Item value={m.id} label={m.name} key={m.id} />
                ))}
              </Picker>
            </View>
          )}
        {currentStep === SaveTrackdaySteps.Motorcycle && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={motorcycle}
              onValueChange={handleOnChange('motorcycle')}
            >
              {motorcycleRes?.data?.motorcycles.map(
                ({ id, year, model }: Motorcycle) => (
                  <Picker.Item
                    value={id}
                    label={`${model.name}(${year})`}
                    key={id}
                  />
                )
              )}
            </Picker>
          </View>
        )}
      </BottomSheet>
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
  pickerWrapper: {
    width: '100%'
  },
  note: {
    height: 100
  },
  btnWrapper: {
    rowGap: 16
  }
})
