import { gql } from '@apollo/client'

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    name
    imageUrl
    group {
      id
      name
    }
  }
`

export const MOTORCYCLE = gql`
  fragment NewMotorcycle on Motorcycle {
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
`

export const TRACKDAY_NOTE = gql`
  fragment NewTrackdayNote on TrackdayNotes {
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
`
