import React from 'react'
import { View, StyleSheet, Keyboard } from 'react-native'
import { useNavigation } from 'expo-router'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Picker } from '@react-native-picker/picker'
import { useSearchParams } from 'expo-router'
import { isEmpty } from 'ramda'

import {
  FACILITIES_QUERY,
  TRACKS_QUERY,
  MOTORCYCLES_QUERY
} from '@graphql/queries'
import { SAVE_TRACKDAY_NOTE } from 'graphql/mutations'
import { TRACKDAY_NOTE } from 'graphql/fragments'
import { Button, Card, Field, Text, Container } from '@components'
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

    case SaveTrackdaySteps.Note:
      return SaveTrackdaySteps.Laptime

    case SaveTrackdaySteps.Submit:
      return SaveTrackdaySteps.Note
  }
}

export default function CreateTrackdayNote() {
  const { date } = useSearchParams()
  const { goBack } = useNavigation()
  const motorcycleRes = useQuery(MOTORCYCLES_QUERY)
  const facilityRes = useQuery(FACILITIES_QUERY)
  const [currentStep, setCurrentStep] = React.useState(
    SaveTrackdaySteps.Facility
  )
  const [motorcycle, setMotorcycle] = React.useState('')
  const [facility, setFacility] = React.useState('')
  const [track, setTrack] = React.useState('')
  const [minutes, setMinutes] = React.useState('')
  const [seconds, setSeconds] = React.useState('')
  const [milliseconds, setMilliseconds] = React.useState('')
  const [note, setNote] = React.useState('')
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

  const onPressHandlers = () => {
    switch (currentStep) {
      case SaveTrackdaySteps.Facility:
        return () => {
          if (!facility) {
            setFacility(facilityRes.data.facilities[0].id)
          }
          setCurrentStep(SaveTrackdaySteps.Track)
        }
      case SaveTrackdaySteps.Track:
        return () => {
          if (!track) {
            setTrack(tracksRes.data.tracks[0].id)
          }
          setCurrentStep(SaveTrackdaySteps.Motorcycle)
        }
      case SaveTrackdaySteps.Motorcycle:
        return () => {
          if (!motorcycle) {
            setMotorcycle(motorcycleRes.data.motorcycles[0].id)
          }
          setCurrentStep(SaveTrackdaySteps.Laptime)
        }
      case SaveTrackdaySteps.Laptime:
        return () => setCurrentStep(SaveTrackdaySteps.Note)
      case SaveTrackdaySteps.Note:
        return () => setCurrentStep(SaveTrackdaySteps.Submit)
      case SaveTrackdaySteps.Submit:
        return () => {
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
        }
    }
  }

  // TODO: refactor to make them reusable
  const getName = (data: any) => (id: string) =>
    data.find((x: any) => x.id === id)?.name || ''

  const getMotorcycleName = (data: any) => (id: string) =>
    data.find((x: any) => x.id === id)?.model.name || ''

  return (
    <Container style={styles.container}>
      {motorcycleRes.called &&
      !motorcycleRes.loading &&
      isEmpty(motorcycleRes.data.motorcycles) ? (
        <NoMotorcycleRegisteredError />
      ) : (
        <>
          <Card>
            <Text>Date: {date}</Text>
            <Text>Track: {getName(tracksRes.data?.tracks || [])(track)}</Text>
            <Text>
              Motorcycle:{' '}
              {getMotorcycleName(motorcycleRes.data?.motorcycles || [])(
                motorcycle
              )}
            </Text>
            <Text>
              Best lap time: {minutes || '00'}:{seconds || '00'}:
              {milliseconds || '000'}
            </Text>
            {currentStep === SaveTrackdaySteps.Submit && <Text>{note}</Text>}
          </Card>
          {currentStep === SaveTrackdaySteps.Facility && (
            <Card>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={facility} onValueChange={setFacility}>
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
                    onValueChange={v => {
                      console.log(v)
                      setTrack(v)
                    }}
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
                  onValueChange={setMotorcycle}
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
          {currentStep === SaveTrackdaySteps.Laptime && (
            <Card>
              <View style={styles.laptimeWrapper}>
                <View style={styles.lapTimeFieldWrapper}>
                  <Field
                    label="Minute"
                    value={minutes}
                    style={styles.lapTimeField}
                    onChangeText={setMinutes}
                    keyboardType="numeric"
                    placeholder="00"
                  />
                  <Text style={styles.laptimeSemicolon}>:</Text>
                </View>
                <View style={styles.lapTimeFieldWrapper}>
                  <Field
                    label="Seconds"
                    value={seconds}
                    onChangeText={setSeconds}
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
                    onChangeText={setMilliseconds}
                    style={styles.lapTimeField}
                    keyboardType="numeric"
                    placeholder="00"
                    returnKeyType="done"
                  />
                </View>
              </View>
            </Card>
          )}
          {currentStep === SaveTrackdaySteps.Note && (
            <Card>
              <Field
                label="Note"
                value={note}
                onChangeText={setNote}
                numberOfLines={3}
                inputStyle={styles.note}
                multiline
                blurOnSubmit
                onSubmitEditing={() => Keyboard.dismiss()}
                returnKeyType="done"
              />
            </Card>
          )}
          <View style={styles.btnWrapper}>
            <Button onPress={onPressHandlers()}>
              {currentStep === SaveTrackdaySteps.Submit ? 'Save' : 'Next'}
            </Button>
            {currentStep !== SaveTrackdaySteps.Facility && (
              <Button
                onPress={() => setCurrentStep(goBackToPreviousStep)}
                variant="secondary"
              >
                Back
              </Button>
            )}
          </View>
        </>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16
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
