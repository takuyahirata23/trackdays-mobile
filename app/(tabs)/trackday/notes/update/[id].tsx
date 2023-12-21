import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { View, StyleSheet, Keyboard, TouchableOpacity } from 'react-native'
import { useQuery, useLazyQuery } from '@apollo/client'
import BottomSheet from '@gorhom/bottom-sheet'
import { Picker } from '@react-native-picker/picker'

import {
  TRACKDAY_NOTE,
  FACILITIES_QUERY,
  TRACKS_QUERY,
  MOTORCYCLES_QUERY
} from '@graphql/queries'
import {
  millisecondsToMinute,
  millisecondsToSeconds,
} from '@functions/lapTimeConverters'
import {
  Button,
  Card,
  Field,
  Text,
  Container,
  BottomSheetHandle,
  KeyboardAvoidingView
} from '@components'
import { useTheme } from 'hooks/useTheme'

import type { TrackdayNote } from '@type/event'
import type { Motorcycle } from '@type/vehicle'
import type { Facility, Track } from '@type/park'

const timeToFields = (lapTime: number) => {
  if (!lapTime) {
    return { minutes: '', seconds: '0', milliseconds: '0' }
  } else {
    const minutes = millisecondsToMinute(lapTime)
    const [seconds, milliseconds] = millisecondsToSeconds(lapTime).toFixed(3).split('.')
    return {
      minutes: String(minutes),
      seconds, 
      milliseconds: milliseconds.replaceAll('0', ''),
    }
  }
}

const trackdayNoteToTrackdayFields = ({
  date,
  track,
  motorcycle,
  lapTime,
  note
}: TrackdayNote) => {
  return {
    date,
    track: track.id,
    motorcycle: motorcycle.id,
    note,
    facility: track.facility.id,
    ...timeToFields(lapTime || 0)
  }
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

enum SaveTrackdaySteps {
  Facility,
  Track,
  Motorcycle,
  Laptime,
  Note,
  Submit
}

export default function Update() {
  const bottomSheetRef = React.useRef<BottomSheet>(null)
  const { id } = useLocalSearchParams()
  const { data } = useQuery(TRACKDAY_NOTE, {
    variables: {
      id
    },
    fetchPolicy: 'cache-only'
  })

  const [
    { date, track, motorcycle, minutes, seconds, milliseconds, note, facility },
    setFields
  ] = React.useState(trackdayNoteToTrackdayFields(data.trackdayNote))
  const [currentStep, setCurrentStep] = React.useState(
    SaveTrackdaySteps.Facility
  )
  const motorcycleRes = useQuery(MOTORCYCLES_QUERY)
  const facilityRes = useQuery(FACILITIES_QUERY)
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

  const {
    colors: { error }
  } = useTheme()

  const getName = (data: any) => (id: string) =>
    data.find((x: any) => x.id === id)?.name || ''

  const getMotorcycleName = (data: any) => (id: string) =>
    data.find((x: any) => x.id === id)?.model.name || ''

  const handleOnChange = (field: string) => (value: string) => {
    if (field === 'facility') {
      setFields(prev => ({ ...prev, [field]: value, track: '' }))
    } else {
      setFields(prev => ({ ...prev, [field]: value }))
    }
  }
  const handleCurrentStepChange = (step: SaveTrackdaySteps) => () => {
    setCurrentStep(step)
    bottomSheetRef.current?.expand()
  }

  const laptimeError = Boolean(
    formError.minutes || formError.seconds || formError.milliseconds
  )

  const handleSubmit = () => null

  const onDone = () => bottomSheetRef.current?.close()

  React.useEffect(() => {
    if (facility) {
      getTracks()
    }
  }, [facility])

  return (
    <Container>
      <>
        <KeyboardAvoidingView>
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
                      label="Milliseconds"
                      value={milliseconds}
                      onChangeText={handleOnChange('milliseconds')}
                      style={styles.lapTimeField}
                      keyboardType="numeric"
                      placeholder="000"
                      returnKeyType="done"
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
              <TouchableOpacity
                onPress={() => setCurrentStep(SaveTrackdaySteps.Note)}
              >
                <Card>
                  <Text>Note: {note}</Text>
                </Card>
              </TouchableOpacity>
            )}
            <View style={styles.btnWrapper}>
              <Button onPress={handleSubmit}>Save</Button>
            </View>
          </View>
        </KeyboardAvoidingView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          enablePanDownToClose
          snapPoints={['40%']}
          handleComponent={() => (
            <BottomSheetHandle
              onPressRight={onDone}
              rightText="Done"
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
