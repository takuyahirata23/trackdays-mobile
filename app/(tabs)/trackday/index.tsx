import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Link } from 'expo-router'
import { Toast } from 'toastify-react-native'

import { GET_MONTHLY_TRACKDAY_DATA } from '@graphql/queries'
import {
  Container,
  Text,
  Card,
  TrackdayLinkCard,
  TrackdayNoteLinkCard,
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
  selected: boolean
  dots: []
}

export default function TrackdayIndex() {
  const { loading, data, error, refetch } = useQuery(
    GET_MONTHLY_TRACKDAY_DATA,
    {
      variables: {
        getEventsByMonthInput: {
          year,
          month
        }
      }
    }
  )

  const {
    colors: { accent, tertiary, secondary }
  } = useTheme()

  const [targetNotes, setTargetNotes] = React.useState([])
  const [targetTrackdays, setTargetTrackdays] = React.useState([])

  const [date, setDate] = React.useState(today)

  React.useEffect(() => {
    if (data?.trackdayNotesByMonth || data?.trackdaysByMonth) {
      const notes = data.trackdayNotesByMonth.filter(
        (x: TrackdayNote) => formatToDateString(x.date) == date
      )
      const trackdays = data.trackdaysByMonth.filter(
        (x: Trackday) => formatToDateString(x.startDatetime) == date
      )
      setTargetNotes(notes)
      setTargetTrackdays(trackdays)
    }
  }, [date, data])

  if (error) {
    console.log('error', error)
    return null
  }

  if (loading) {
    return (
      <Container>
        <Text>Loading</Text>
      </Container>
    )
  }

  const formatToDateString = (dateTime: string) => dateTime.split(' ')[0]

  const events = data.trackdayNotesByMonth.reduce(
    (acc: Events, x: TrackdayNote) => {
      return {
        ...acc,
        [formatToDateString(x.date)]: {
          dots: [{ color: accent }],
          selectedColor: secondary,
          marked: true,
          selected: formatToDateString(x.date) === date
        }
      }
    },
    {
      [date]: {
        selectedColor: secondary,
        selected: true
      }
    }
  )

  const trackdays = data.trackdaysByMonth.reduce((acc: Events, x: Trackday) => {
    return {
      ...acc,
      [formatToDateString(x.startDatetime)]: {
        dots: [
          // @ts-ignore
          ...(acc[formatToDateString(x.startDatetime)]?.dots || []),
          { color: tertiary }
        ],
        selectedColor: secondary,
        marked: true,
        selected: formatToDateString(x.startDatetime) === date
      }
    }
  }, events)

  const onDayPress = (d: DateData) => setDate(d.dateString)

  const onMonthChange = (d: DateData) =>
    refetch({
      getEventsByMonthInput: {
        year: Number(d.year),
        month: Number(d.month)
      }
    })

  return (
    <Container style={{ paddingTop: 0, paddingHorizontal: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={{ marginTop: 20 }}>
          <Card>
            <Calendar
              initialDate={today}
              markedDates={trackdays}
              onDayPress={onDayPress}
              onMonthChange={onMonthChange}
              markingType="multi-dot"
            />
          </Card>
        </View>
        <View style={styles.contentWrapper}>
          {targetNotes.map((note: TrackdayNote) => (
            <TrackdayNoteLinkCard {...note} key={note.id} />
          ))}
          {targetTrackdays.map((trackday: Trackday) => (
            <TrackdayLinkCard key={trackday.id} {...trackday} />
          ))}
          <Link
            href={{
              pathname: '/trackday/create-trackday-note',
              params: { date }
            }}
            asChild
          >
            <TouchableOpacity>
              <TrackdayAddCard />
            </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.contentWrapper}></View>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20
  },
  contentWrapper: {
    marginTop: 16,
    rowGap: 8
  }
})
