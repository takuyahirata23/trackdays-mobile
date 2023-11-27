import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Link } from 'expo-router'

import { GET_MONTHLY_TRACKDY_DATA } from '@graphql/queries'
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
  const { loading, data, error, refetch } = useQuery(GET_MONTHLY_TRACKDY_DATA, {
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

  const [targetNotes, setTargetNotes] = React.useState([])
  const [targetTrackdays, setTargetTrackdays] = React.useState([])

  const [date, setDate] = React.useState(today)

  React.useEffect(() => {
    if (data?.trackdayNotesByMonth || data?.trackdaysByMonth) {
      const notes = data.trackdayNotesByMonth.filter(
        (x: TrackdayNote) => x.date == date
      )
      const trackdays = data.trackdaysByMonth.filter(
        (x: Trackday) => x.date == date
      )
      setTargetNotes(notes)
      setTargetTrackdays(trackdays)
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

  const keys: Record<string, object> = {
    note: { key: 'note', color: 'blue' },
    ['Trackday Ontario']: { key: 'trackdaysOntario', color: 'red' },
    ['Riders Ontario']: { key: 'ridersOntario', color: 'yellow' }
  }

  const events = data.trackdayNotesByMonth.reduce(
    (acc: Events, x: TrackdayNote) => {
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

  const trackdays = data.trackdaysByMonth.reduce((acc: Events, x: Trackday) => {
    return {
      ...acc,
      [x.date]: {
        // @ts-ignore
        dots: [...(acc[x.date]?.dots || []), keys[x.organization.name]],
        selectedColor: btnBgSecondary,
        marked: true,
        selected: x.date === date
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
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
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
  contentWrapper: {
    marginTop: 16,
    rowGap: 8
  }
})
