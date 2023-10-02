import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, View } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'

import { TRACKDAYS_BY_MONTH } from '@graphql/queries'
import { Container, Text, Card, TrackdayLinkCard } from '@components'
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
  const { loading, data, error, refetch } = useQuery(TRACKDAYS_BY_MONTH, {
    variables: {
      getTrackdaysByMonthInput: {
        year,
        month
      }
    }
  })

  const {
    colors: { btnBgSecondary }
  } = useTheme()

  const [trackday, setTrackday] = React.useState<null | Trackday>(null)

  const [date, setDate] = React.useState<null | string>(null)

  React.useEffect(() => {
    if (date) {
      setTrackday(data?.trackdaysByMonth.find((x: any) => x.date == date))
    }
  }, [date])

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

  const events = data.trackdaysByMonth.reduce(
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
    {}
  )

  const onDayPress = (d: DateData) => setDate(d.dateString)
  const onMonthChange = (d: DateData) =>
    refetch({
      getTrackdaysByMonthInput: {
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
        {trackday && <TrackdayLinkCard {...trackday} />}
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    marginTop: 16
  }
})
