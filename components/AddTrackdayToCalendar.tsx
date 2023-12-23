import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'
import * as Calendar from 'expo-calendar'
import { useLocalSearchParams } from 'expo-router'

import { TRACKDAY } from '@graphql/queries'
import { SAVE_USER_TRACKDAY_CALENDAR } from '@graphql/mutations'
import { useTheme } from '@hooks/useTheme'
import { createCalendar } from '@utils/calendar'
import { getCalendarId } from '@utils/secureStore'

export function AddTrackdayToCalendar() {
  const { id } = useLocalSearchParams()
  const [hasTrackdayBeenAdded, setHasTrackdayBeenAdded] = React.useState(false)
  const {
    colors: { primary }
  } = useTheme()
  const { data, loading, error } = useQuery(TRACKDAY, {
    variables: {
      id
    }
  })

  const [status, requestPermission] = Calendar.useCalendarPermissions()
  const [saveUserTrackdayCalendar] = useMutation(SAVE_USER_TRACKDAY_CALENDAR, {
    onError(e) {
      console.log(e)
    },
    onCompleted() {
      setHasTrackdayBeenAdded(true)
    }
  })

  if (loading || error) {
    return null
  }

  const { startDatetime, endDatetime, organization, track } = data.trackday

  const { id: userTrackdayCalendarId } = data.userTrackdayCalendar || {}

  const handlePress = async () => {
    if (status?.granted && typeof id === 'string') {
      let calendarId = await getCalendarId()

      if (!calendarId) {
        calendarId = await createCalendar()
      }

      await Calendar.createEventAsync(calendarId, {
        organizer: organization.name,
        startDate: new Date(startDatetime),
        endDate: new Date(endDatetime),
        title: `${track.facility.name}(${track.name})`,
        id
      })
      saveUserTrackdayCalendar({
        variables: {
          saveUserTrackdayCalendarInput: {
            calendarId,
            trackdayId: id
          }
        }
      })
    } else if (status?.canAskAgain) {
      await requestPermission()
    } else {
      console.log('no access')
    }
  }
  return hasTrackdayBeenAdded || userTrackdayCalendarId ? (
    <FontAwesome name="calendar-check-o" size={20} color={primary} />
  ) : (
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
