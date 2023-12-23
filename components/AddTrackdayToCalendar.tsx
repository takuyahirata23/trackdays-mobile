import React from 'react'
import { TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useQuery } from '@apollo/client'
import * as Calendar from 'expo-calendar'
import { useLocalSearchParams } from 'expo-router'

import { TRACKDAY } from '@graphql/queries'
import { useTheme } from '@hooks/useTheme'

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync()
  return defaultCalendar.source
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Trackdays' }

  return await Calendar.createCalendarAsync({
    title: 'Trackdays Calendar',
    color: '#279B47',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER
  })
}

export function AddTrackdayToCalendar() {
  const { id } = useLocalSearchParams()
  const {
    colors: { primary }
  } = useTheme()
  const { data, loading, error } = useQuery(TRACKDAY, {
    variables: {
      id
    }
  })


  React.useEffect(() => {
   (async () => {
     const { status } = await Calendar.requestCalendarPermissionsAsync();
     if (status === 'granted') {
       console.log('good')
     } else {
       console.log('no access')
     }
   })();
  }, []);
  //
  if (loading || error) {
    return null
  }
  const { date, organization, track } = data.trackday

  const handlePress = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync()
    if (status === 'granted' && typeof id === 'string') {
      const calendarId = await createCalendar() 
      const res = await Calendar.createEventAsync(calendarId, {
        organizer: organization.name,
        startDate: new Date(date),
        endDate: new Date(date),
        title: `${track.facility.name}(${track.name})`,
        url: organization.homepageUrl,
        recurrenceRule: null
      })
      console.log(res)

      const event = Calendar.getEventAsync(res)
      console.log(event)
    } else {
      console.log('Please grant access to calendar')
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.iconPadding}>
      <FontAwesome name="calendar-plus-o" size={20} color={primary} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  iconPadding: {
    padding: 4
  }
  })
