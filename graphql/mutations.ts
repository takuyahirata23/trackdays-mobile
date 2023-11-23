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

export const SAVE_TRACKDAY_NOTE = gql`
  mutation saveTrackdayNote($saveTrackdayNoteInput: SaveTrackdayNoteInput!) {
    saveTrackdayNote(saveTrackdayNoteInput: $saveTrackdayNoteInput) {
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

export const UPDATE_TRACKDAY_NOTE = gql`
  mutation updateTrackdayNote(
    $updateTrackdayNoteInput: UpdateTrackdayNoteInput!
  ) {
    updateTrackdayNote(updateTrackdayNoteInput: $updateTrackdayNoteInput) {
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

export const DELETE_TRACKDAY_NOTE = gql`
  mutation deleteTrackdayNote($id: ID!) {
    deleteTrackdayNote(id: $id) {
      id
    }
  }
`
