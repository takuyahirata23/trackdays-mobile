import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Link } from 'expo-router'

import { TRACKDAY_NOTES_BY_MONTH } from '@graphql/queries'
import {
  Container,
  Text,
  Card,
  TrackdayLinkCard,
  TrackdayAddCard
} from '@components'
import { useTheme } from '@hooks/useTheme'

import type { Trackday } from '@type/event'

const today = new Date().toISOString().split('T')[0]
const dateArray = today.split('-')
const year = Number(dateArray[0])
const month = Number(dateArray[1])

type TrackdayDate = {
  selectedColor: string
  marked: boolean
  selected: boolean
}

export default function TrackdayIndex() {
  const { loading, data, error, refetch } = useQuery(TRACKDAY_NOTES_BY_MONTH, {
    variables: {
      getTrackdayNotesByMonthInput: {
        year,
        month
      }
    }
  })

  console.log(data)

  const {
    colors: { btnBgSecondary }
  } = useTheme()

  const [trackday, setTrackday] = React.useState<null | Trackday>(null)

  const [date, setDate] = React.useState(today)

  React.useEffect(() => {
    if (date && data?.trackdayNotesByMonth) {
      setTrackday(data.trackdayNotesByMonth.find((x: any) => x.date == date))
    }
  }, [date, data])

  if (error) {
    return null
  }

  if (loading) {
    return (
      <Container>
        <Text>Loading</Text>
      </Container>
    )
  }

  const events = data.trackdayNotesByMonth.reduce(
    (acc: TrackdayDate, x: Trackday) => {
      return {
        ...acc,
        [x.date]: {
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

  const onDayPress = (d: DateData) => setDate(d.dateString)
  const onMonthChange = (d: DateData) =>
    refetch({
      getTrackdayNotesByMonthInput: {
        year: Number(d.year),
        month: Number(d.month)
      }
    })

  return (
    <Container>
      <Card>
        <Calendar
          initialDate={today}
          markedDates={events}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
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
