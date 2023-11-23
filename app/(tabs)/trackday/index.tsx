import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Link } from 'expo-router'

import { TRACKDAY_NOTES_BY_MONTH, GET_MONTHLY_TRACKDY_DATA, TRACKDAYS_BY_MONTH } from '@graphql/queries'
import {
  Container,
  Text,
  Card,
  TrackdayLinkCard,
  TrackdayAddCard
} from '@components'
import { useTheme } from '@hooks/useTheme'

import type { TrackdayNote, Trackday } from '@type/event'

const today = new Date().toISOString().split('T')[0]
const dateArray = today.split('-')
const year = Number(dateArray[0])
const month = Number(dateArray[1])

type Events = {
  selectedColor: string
  marked: boolean
  selected: boolean,
  dots: []
}

export default function TrackdayIndex() {
  const d = useQuery(GET_MONTHLY_TRACKDY_DATA, {
    variables: {
      getEventsByMonthInput: {
        year,
        month
      }
    }
  })

  const { loading, data, error, refetch } = useQuery(TRACKDAY_NOTES_BY_MONTH, {
    variables: {
      getEventsByMonthInput: {
        year,
        month
      }
    }
  })

  const {
    colors: { btnBgSecondary }
  } = useTheme()

  const [trackday, setTrackday] = React.useState(null)

  const [date, setDate] = React.useState(today)

  React.useEffect(() => {
    if (date && data?.trackdayNotesByMonth) {
      setTrackday(data.trackdayNotesByMonth.find((x: any) => x.date == date))
    }
  }, [date, data])

  if (error) {
    return null
  }

  if (loading || d.loading) {
    return (
      <Container>
        <Text>Loading</Text>
      </Container>
    )
  }

  const keys: Record<string, object> = {
    note: { key: 'note', color: 'blue'},
    ["Trackday Ontario"]: { key: 'trackdaysOntario', color: 'red'},
    ["Riders Ontario"]: { key: 'ridersOntario', color: 'yellow'}
  }

  const events = data.trackdayNotesByMonth.reduce(
     (acc: Events, x: TrackdayNote, i: number) => {
      return {
        ...acc,
        [x.date]: {
          dots: [keys.note],
          selectedColor: btnBgSecondary,
          marked: true,
          selected: x.date === date
        }
      }
    },
    {
      [date]: {
        selectedColor: btnBgSecondary,
        selected: true
      }
    }
  )


  const trackdays = d.data.trackdaysByMonth.reduce((acc: Events, x: Trackday) => {
     return {
       ...acc,
       [x.date]: {
         // @ts-ignore
         dots: [...acc[x.date]?.dots || [], keys[x.organization.name]],
          selectedColor: btnBgSecondary,
          marked: true,
          selected: x.date === date
       }
     }
  }, events)

  console.log(trackdays['2023-11-26'])


  const onDayPress = (d: DateData) => setDate(d.dateString)

  const onMonthChange = (d: DateData) =>
    refetch({
      getEventsByMonthInput: {
        year: Number(d.year),
        month: Number(d.month)
      }
    })

  return (
    <Container>
      <Card>
        <Calendar
          initialDate={today}
          markedDates={trackdays}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          markingType="multi-dot"
        />
      </Card>
      <View style={styles.contentWrapper}>
        {trackday ? (
          <TrackdayLinkCard {...trackday} />
        ) : (
          <Link
            href={{
              pathname: '/trackday/note',
              params: { date }
            }}
            asChild
          >
            <TouchableOpacity>
              <TrackdayAddCard />
            </TouchableOpacity>
          </Link>
        )}
      </View>
      <View style={styles.contentWrapper}></View>
    </Container>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    marginTop: 16
  }
})
