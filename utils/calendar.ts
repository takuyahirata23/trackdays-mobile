import { Platform } from 'react-native'
import * as Calendar from 'expo-calendar'
import { setCalendarId } from './secureStore'

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync()
  return defaultCalendar.source
}

export async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Trackdays' }

  const calendarId = await Calendar.createCalendarAsync({
    title: 'Trackdays',
    color: '#279B47',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER
  })

  setCalendarId(calendarId)
  return calendarId
}
