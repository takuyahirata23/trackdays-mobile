import React from 'react'
import { View, StyleSheet, Keyboard } from 'react-native'
import { useNavigation } from 'expo-router'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Picker } from '@react-native-picker/picker'
import { useSearchParams } from 'expo-router'
import { isEmpty } from 'ramda'
import BottomSheet from '@gorhom/bottom-sheet'

import {
  FACILITIES_QUERY,
  TRACKS_QUERY,
  MOTORCYCLES_QUERY
} from '@graphql/queries'
import { SAVE_TRACKDAY_NOTE } from 'graphql/mutations'
import { TRACKDAY_NOTE } from 'graphql/fragments'
import {
  Button,
  Card,
  Field,
  Text,
  Container,
  BottomSheetHandle,
  KeyboardAvoidingView
} from '@components'
import {
  minutesToMilliseconds,
  secondsToMilliseconds
} from '@functions/lapTimeConverters'

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

const NoMotorcycleRegisteredError = () => (
  <Text>Please regiter motorcycle first</Text>
)

const goBackToPreviousStep = (prev: SaveTrackdaySteps) => {
  switch (prev) {
    case SaveTrackdaySteps.Track:
      return SaveTrackdaySteps.Facility

    case SaveTrackdaySteps.Motorcycle:
      return SaveTrackdaySteps.Track

    case SaveTrackdaySteps.Laptime:
      return SaveTrackdaySteps.Motorcycle
  }
}

export default function CreateTrackdayNote() {
  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const { date: dateParam } = useSearchParams()
  const { goBack } = useNavigation()
  const motorcycleRes = useQuery(MOTORCYCLES_QUERY)
  const facilityRes = useQuery(FACILITIES_QUERY)
  const [currentStep, setCurrentStep] = React.useState(
    SaveTrackdaySteps.Facility
  )
  const [
    { date, facility, track, motorcycle, minutes, seconds, milliseconds, note },
    setFields
  ] = React.useState({
    date: dateParam,
    facility: '',
    track: '',
    motorcycle: '',
    minutes: '',
    seconds: '',
    milliseconds: '',
    note: ''
  })
  const [getTracks, tracksRes] = useLazyQuery(TRACKS_QUERY, {
    variables: {
      facilityId: facility
    }
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
      goBack()
    }
  })

  React.useEffect(() => {
    if (facility) {
      getTracks()
    }
  }, [facility])

  const laptimeToMilliseconds = () =>
    minutesToMilliseconds(Number(minutes)) +
    secondsToMilliseconds(Number(seconds)) +
    Number(milliseconds)

  const handleOnChange = (field: string) => (value: string) =>
    setFields(prev => ({ ...prev, [field]: value }))

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
    saveTrackdayNote({
      variables: {
        saveTrackdayNoteInput: {
          date,
          lapTime: laptimeToMilliseconds(),
          motorcycleId: motorcycle,
          trackId: track,
          note: note
        }
      }
    })

  return (
    <Container>
      {motorcycleRes.called &&
      !motorcycleRes.loading &&
      isEmpty(motorcycleRes.data.motorcycles) ? (
        <NoMotorcycleRegisteredError />
      ) : (
        <>
          <KeyboardAvoidingView>
            <View style={styles.container}>
              <Card>
                <Text>Date: {date}</Text>
              </Card>
              <Card>
                <Text>
                  Facility:{' '}
                  {getName(facilityRes.data?.facilities || [])(facility)}
                </Text>
              </Card>
              <Card>
                <Text>
                  Track: {getName(tracksRes.data?.tracks || [])(track)}
                </Text>
              </Card>
              <Card>
                <Text>
                  Motorcycle:{' '}
                  {getMotorcycleName(motorcycleRes.data?.motorcycles || [])(
                    motorcycle
                  )}
                </Text>
              </Card>
              {currentStep === SaveTrackdaySteps.Laptime ? (
                <Card>
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
                        onEndEditing={() => {
                          setCurrentStep(SaveTrackdaySteps.Note)
                        }}
                      />
                    </View>
                  </View>
                </Card>
              ) : (
                <Card>
                  <Text>
                    Best lap time: {minutes || '00'}:{seconds || '00'}:
                    {milliseconds || '000'}
                  </Text>
                </Card>
              )}
              {currentStep === SaveTrackdaySteps.Note ? (
                <Card>
                  <Field
                    label="Note"
                    value={note}
                    onChangeText={handleOnChange('note')}
                    numberOfLines={3}
                    inputStyle={styles.note}
                    multiline
                    blurOnSubmit
                    onSubmitEditing={() => {
                      setCurrentStep(SaveTrackdaySteps.Submit)
                      Keyboard.dismiss()
                    }}
                    returnKeyType="done"
                  />
                </Card>
              ) : (
                <Card>
                  <Text>Note: {note}</Text>
                </Card>
              )}
              <View style={styles.btnWrapper}>
                <Button onPress={handleSubmit}>Save</Button>
              </View>
            </View>
          </KeyboardAvoidingView>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['40%']}
            handleComponent={() => (
              <BottomSheetHandle
                onPressRight={onPressHandlers()}
                rightText="Next"
                onPressLeft={() => setCurrentStep(goBackToPreviousStep)}
                leftText={currentStep !== SaveTrackdaySteps.Facility && 'Back'}
              />
            )}
          >
            {currentStep === SaveTrackdaySteps.Facility && (
              <Card>
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
              </Card>
            )}
            {currentStep === SaveTrackdaySteps.Track && (
              <Card>
                {facility && tracksRes.data && (
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
              </Card>
            )}
            {currentStep === SaveTrackdaySteps.Motorcycle && (
              <Card>
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
              </Card>
            )}
          </BottomSheet>
        </>
      )}
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
  pickerWrapper: {
    width: '100%'
  },
  note: {
    height: 100
  },
  btnWrapper: {
    marginTop: 'auto',
    rowGap: 16
  }
})
