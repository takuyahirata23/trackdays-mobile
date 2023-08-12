import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Picker } from '@react-native-picker/picker'

import {
  FACILITIES_QUERY,
  TRACKS_QUERY,
  MOTORCYCLES_QUERY
} from '@graphql/queries'
import { Button, Card, Field, Text } from '@components'

import type { Motorcycle } from '@type/vehicle'
import type { Facility, Track } from '@type/park'

export function SaveTrackday() {
  const motorcycleRes = useQuery(MOTORCYCLES_QUERY)
  const facilityRes = useQuery(FACILITIES_QUERY)
  const [motorcycle, setMotorcycle] = React.useState('')
  const [facility, setFacility] = React.useState('')
  const [track, setTrack] = React.useState('')
  const [getTracks, tracksRes] = useLazyQuery(TRACKS_QUERY, {
    variables: {
      facilityId: facility
    }
  })

  React.useEffect(() => {
    if (facility) {
      getTracks()
    }
  }, [facility])

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.laptimeWrapper}>
          <View style={styles.lapTimeFieldWrapper}>
            <Field label="Minute" value="1" style={styles.lapTimeField} />
            <Text style={styles.laptimeSemicolon}>:</Text>
          </View>
          <View style={styles.lapTimeFieldWrapper}>
            <Field label="Seconds" value="23" style={styles.lapTimeField} />
            <Text style={styles.laptimeSemicolon}>:</Text>
          </View>
          <View style={styles.lapTimeFieldWrapper}>
            <Field
              label="Miliseconds"
              value="230"
              style={styles.lapTimeField}
            />
          </View>
        </View>
      </Card>
      <Card>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={motorcycle} onValueChange={setMotorcycle}>
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
      <Card>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={facility} onValueChange={setFacility}>
            {facilityRes?.data?.facilities.map((m: Facility) => (
              <Picker.Item value={m.id} label={m.name} key={m.id} />
            ))}
          </Picker>
        </View>
      </Card>
      <Card>
        {facility && tracksRes.data && (
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={track} onValueChange={setTrack}>
              {tracksRes?.data?.tracks?.map((m: Track) => (
                <Picker.Item value={m.id} label={m.name} key={m.id} />
              ))}
            </Picker>
          </View>
        )}
      </Card>
    </View>
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
  }
})
