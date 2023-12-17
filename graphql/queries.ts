import { gql } from '@apollo/client'

export const USER_QUERY = gql`
  query getUser {
    user {
      id
      email
      name
      imageUrl
      group {
        id
        name
      }
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
  query getMotorcycles {
    motorcycles {
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
`

export const FACILITIES_QUERY = gql`
  query getFacilities {
    facilities {
      id
      name
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

export const TRACKDAYS = gql`
  query getTrackdays {
    trackdays {
      id
      date
      track {
        id
        facility {
          id
          name
        }
      }
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
`

export const TRACKDAY_NOTES_BY_MONTH = gql`
  query getTrackdayNotesByMonth(
    $getEventsByMonthInput: GetEventsByMonthInput!
  ) {
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

export const TRACKDAYS_BY_MONTH = gql`
  query getTrackdaysByMonth($getEventsByMonthInput: GetEventsByMonthInput!) {
    trackdaysByMonth(getEventsByMonthInput: $getEventsByMonthInput) {
      id
      date
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
  }
`

export const TRACKDAY = gql`
  query getTrackday($id: ID!) {
    trackday(id: $id) {
      id
      date
      price
      description
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
  }
`

export const GET_MONTHLY_TRACKDAY_DATA = gql`
  query getMonthlyTrackdayData($getEventsByMonthInput: GetEventsByMonthInput!) {
    trackdaysByMonth(getEventsByMonthInput: $getEventsByMonthInput) {
      id
      date
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
