import { gql } from '@apollo/client'

export const REGISTER_MOTORCYCLE = gql`
  mutation registerMotorcycle(
    $registerMotorcycleInput: RegisterMotorcycleInput!
  ) {
    registerMotorcycle(registerMotorcycleInput: $registerMotorcycleInput) {
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

export const SAVE_TRACKDAY = gql`
  mutation saveTrackday($saveTrackdayInput: SaveTrackdayInput!) {
    saveTrackday(saveTrackdayInput: $saveTrackdayInput) {
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
