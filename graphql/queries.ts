import { gql } from '@apollo/client'

import { USER_FIELDS, MOTORCYCLE_FIELDS } from './fragments'

export const USER_QUERY = gql`
  ${USER_FIELDS}
  query getUser {
    user {
      ...UserFields
    }
  }
`

export const GROUPS = gql`
  query getGroups {
    groups {
      id
      name
    }
  }
`

export const MAKES_QUERY = gql`
  query getMakes {
    makes {
      id
      name
    }
  }
`

export const MODELS_QUERY = gql`
  query getModels($makeId: ID!) {
    models(makeId: $makeId) {
      id
      name
    }
  }
`

export const MOTORCYCLES_QUERY = gql`
  ${MOTORCYCLE_FIELDS}
  query getMotorcycles {
    motorcycles {
      ...MotorcycleFields
    }
  }
`

export const MOTORCYCLE_QUERY = gql`
  ${MOTORCYCLE_FIELDS}
  query getMotorcycle($id: ID!) {
    motorcycle(id: $id) {
      ...MotorcycleFields
      trackdayNotes {
        id
        date
        lapTime
        track {
          id
          name
          facility {
            id
            name
          }
        }
      }
    }
  }
`

export const FACILITIES_QUERY = gql`
  query getFacilities {
    facilities {
      id
      name
      description
    }
  }
`

export const TRACKS_QUERY = gql`
  query getTracks($facilityId: ID!) {
    tracks(facilityId: $facilityId) {
      id
      name
    }
  }
`

export const TRACKDAY_NOTE = gql`
  query getTrackdayNote($id: ID!) {
    trackdayNote(id: $id) {
      id
      date
      lapTime
      note
      motorcycle {
        id
        year
        model {
          id
          name
          make {
            id
            name
          }
        }
      }
      track {
        id
        name
        facility {
          id
          name
        }
      }
    }
  }
`

export const BEST_LAP_FOR_EACH_TRACK = gql`
  query getBestLapsForEachTrack {
    bestLapForEachTrack {
      id
      lapTime
      track {
        id
        name
        facility {
          id
          name
        }
      }
      motorcycle {
        id
        model {
          id
          name
        }
      }
    }
  }
`

export const TRACKDAY = gql`
  query getTrackday($id: ID!) {
    trackday(id: $id) {
      id
      startDatetime
      endDatetime
      price
      description
      trackdaysRegistrationUrl
      organization {
        id
        name
        trackdaysRegistrationUrl
        homepageUrl
        trackdaysRegistrationUrl
        defaultNote
      }
      track {
        id
        name
        facility {
          id
          name
        }
      }
    }
    userTrackdayCalendar(trackdayId: $id) {
      id
      eventId
    }
  }
`

export const GET_MONTHLY_TRACKDAY_DATA = gql`
  query getMonthlyTrackdayData($getEventsByMonthInput: GetEventsByMonthInput!) {
    trackdaysByMonth(getEventsByMonthInput: $getEventsByMonthInput) {
      id
      startDatetime
      endDatetime
      price
      organization {
        id
        name
        trackdaysRegistrationUrl
      }
      track {
        id
        name
        facility {
          id
          name
        }
      }
    }

    trackdayNotesByMonth(getEventsByMonthInput: $getEventsByMonthInput) {
      id
      date
      lapTime
      motorcycle {
        id
        model {
          id
          name
        }
      }
      track {
        id
        facility {
          id
          name
        }
      }
    }
  }
`
export const UPCOMING_TRACKDAYS = gql`
  query getUpcomingTrackdays {
    upcomingTrackdays {
      id
      startDatetime
      track {
        id
        facility {
          id
          name
        }
      }
      organization {
        id
        name
      }
    }
  }
`

export const FACILITY_LEADERBOARD_AND_AVERAGE_TIMES_QUERY = gql`
  query getFacilityLeaderboardAndAverageLapTimes($facilityId: ID!) {
    facility(id: $facilityId) {
      id
      name
      description
    }
    tracksWithLeaderboardAndAverageLapTimes(facilityId: $facilityId) {
      id
      name
      length
      averageLapTimes {
        group {
          id
          name
        }
        averageLapTime
      }
      trackdayNotes {
        user {
          id
          name
          imageUrl
        }
        id
        lapTime
        motorcycle {
          id
          year
          model {
            id
            name
            make {
              id
              name
            }
          }
        }
      }
    }
  }
`
