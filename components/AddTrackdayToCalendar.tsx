import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'
import * as Calendar from 'expo-calendar'
import { useLocalSearchParams } from 'expo-router'
import { Toast } from 'toastify-react-native'

import { TRACKDAY } from '@graphql/queries'
import {
  SAVE_USER_TRACKDAY_CALENDAR,
  DELETE_USER_TRACKDAY_CALENDAR
} from '@graphql/mutations'
import { useTheme } from '@hooks/useTheme'
import { createCalendar } from '@utils/calendar'
import { getCalendarId } from '@utils/secureStore'

const today = new Date()

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
  const [saveUserTrackdayCalendar, { loading: isSaving }] = useMutation(
    SAVE_USER_TRACKDAY_CALENDAR,
    {
      onError() {
        Toast.error('There was a problem adding to calendar', 'bottom')
      },
      onCompleted() {
        setHasTrackdayBeenAdded(true)
        Toast.success('Added to your calendar', 'bottom')
      },
      refetchQueries: [TRACKDAY]
    }
  )

  const [deleteUserTrackdayCalendar, { loading: isDeleting }] = useMutation(
    DELETE_USER_TRACKDAY_CALENDAR,
    {
      onError() {
        Toast.error('There was a problem deleting from calendar', 'bottom')
      },
      onCompleted() {
        setHasTrackdayBeenAdded(false)
        Toast.success('Deleted from your calendar', 'bottom')
      },
      refetchQueries: [TRACKDAY]
    }
  )

  if (loading || error) {
    return null
  }

  const { startDatetime, endDatetime, organization, track } = data.trackday

  const { id: userTrackdayCalendarId, eventId } =
    data.userTrackdayCalendar || {}

  const isFeatureEvent = today < new Date(startDatetime)

  if (!isFeatureEvent) {
    return null
  }

  const handleUserTrackdayAddition = async () => {
    try {
      if (status?.granted && typeof id === 'string') {
        let calendarId = await getCalendarId()

        if (!calendarId) {
          calendarId = await createCalendar()
        }

        const eventId = await Calendar.createEventAsync(calendarId, {
          organizer: organization.name,
          startDate: new Date(startDatetime),
          endDate: new Date(endDatetime),
          title: `${track.facility.name}(${track.name})`
        })

        saveUserTrackdayCalendar({
          variables: {
            saveUserTrackdayCalendarInput: {
              calendarId,
              eventId,
              trackdayId: id
            }
          }
        })
      } else if (status?.canAskAgain) {
        await requestPermission()
      } else {
        Toast.error('Error. There was a problem', 'bottom')
      }
    } catch (e:any) {
      if(e.code === "E_INVALID_CALENDAR_ID") {
        const calendarId = await createCalendar()
        const eventId = await Calendar.createEventAsync(calendarId, {
          organizer: organization.name,
          startDate: new Date(startDatetime),
          endDate: new Date(endDatetime),
          title: `${track.facility.name}(${track.name})`
        })

        saveUserTrackdayCalendar({
          variables: {
            saveUserTrackdayCalendarInput: {
              calendarId,
              eventId,
              trackdayId: id
            }
          }
        })
      }
    }
  }

  const handleUserTrackdayDeletion = async () => {
    deleteUserTrackdayCalendar({
      variables: {
        trackdayId: id
      }
    })

    try {
      Calendar.deleteEventAsync(eventId)
    } catch (e) {
      Toast.error('Error. There was a problem', 'bottom')
    }
  }

  return hasTrackdayBeenAdded || userTrackdayCalendarId ? (
    <TouchableOpacity
      disabled={loading || isSaving || isDeleting}
      onPress={handleUserTrackdayDeletion}
      style={styles.iconPadding}
    >
      <FontAwesome name="calendar-times-o" size={20} color={primary} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      disabled={loading || isSaving || isDeleting}
      onPress={handleUserTrackdayAddition}
      style={styles.iconPadding}
    >
      <FontAwesome name="calendar-plus-o" size={20} color={primary} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  iconPadding: {
    padding: 4
  }
})
