import React from 'react'
import { useQuery } from '@apollo/client'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Link } from 'expo-router'
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons'

import { TRACKDAYS_BY_MONTH } from '@graphql/queries'
import { Container, Text, Card, IconLabel } from '@components'
import { formatLapTime } from '@functions/lapTimeConverters'
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
    colors: { btnBgSecondary, primary }
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
      {trackday && (
        <Link
          href={{
            pathname: '/trackday/[id]',
            params: { id: trackday.id }
          }}
          asChild
        >
          <TouchableOpacity>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>
                {trackday.track.facility.name}
              </Text>
              <View style={styles.cardDetail}>
                <Card variant="secondary">
                  <IconLabel
                    icon={
                      <MaterialCommunity
                        name="motorbike"
                        size={24}
                        color={primary}
                      />
                    }
                    label={trackday.motorcycle.model.name}
                  />
                </Card>
                <Card variant="secondary">
                  <IconLabel
                    icon={
                      <MaterialCommunity
                        name="timer"
                        size={24}
                        color={primary}
                      />
                    }
                    label={formatLapTime(Number(trackday.lapTime))}
                  />
                </Card>
              </View>
            </Card>
          </TouchableOpacity>
        </Link>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    rowGap: 6
  },
  cardTitle: {
    fontWeight: '600'
  },
  cardDetail: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  }
})
