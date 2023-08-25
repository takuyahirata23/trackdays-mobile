import { gql } from '@apollo/client'

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

export const TRACKDAY = gql`
  fragment NewTrackday on Trackdays {
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
