import React from 'react'
import { useQuery } from '@apollo/client'
import {  StyleSheet } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'

import { TRACKDAYS } from '@graphql/queries'
import { Container, Text, Card } from '@components'

export default function TrackdayIndex() {
  const { loading, data, error } = useQuery(TRACKDAYS)
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0])

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

  const events = data.trackdays.reduce((acc: any, x: any) => {
    return {
      ...acc,
      [x.date]: { selectedColor: 'blue', selected: true }
    }
  }, {})

  const onDayPress = (d: DateData) => console.log(d)

  return (
    <Container>
      <Calendar
        initialDate={date}
        markedDates={events}
        onDayPress={onDayPress}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  cardSeparator: {
    marginTop: 16
  },
  card: {
    rowGap: 8
  },
  cardFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  date: {
    fontSize: 14
  }
})
