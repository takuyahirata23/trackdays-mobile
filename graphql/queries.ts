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
export const TRACKDAY_QUERY = gql`
  query getTrackday($id: ID!) {
    trackday(id: $id) {
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
