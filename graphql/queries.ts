import { gql } from '@apollo/client'

export const USER_QUERY = gql`
  query getUser {
    user {
      email
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
      model
      make
    }
  }
`

// export const FACILITIES_QUERY = gql`
//   query getFacilities {
//     facilities {
//       id
//       name
//       description
//     }
//   }
// `

// export const FACILITI_QUERY = gql`
//   query getFacility($id: ID!) {
//     facility(id: $id) {
//       id
//       name
//       description
//       tracks {
//         id
//         name
//         length
//       }
//     }
//   }
// `

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
