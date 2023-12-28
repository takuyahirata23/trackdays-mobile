import { gql } from '@apollo/client'
import { USER_FIELDS } from './fragments'

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

export const ARCHIVE_MOTORCYCLE = gql`
  mutation archiveMotorcycle($id: ID!) {
    archiveMotorcycle(id: $id) {
      id
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
      lapTime
      note
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

export const UPDATE_GROUP = gql`
  ${USER_FIELDS}
  mutation updateGroup($groupId: ID!) {
    updateGroup(groupId: $groupId) {
      ...UserFields
    }
  }
`

export const SAVE_USER_TRACKDAY_CALENDAR = gql`
  mutation saveUserTrackdayCalendar(
    $saveUserTrackdayCalendarInput: SaveUserTrackdayCalendarInput!
  ) {
    saveUserTrackdayCalendar(
      saveUserTrackdayCalendarInput: $saveUserTrackdayCalendarInput
    ) {
      id
      eventId
    }
  }
`

export const DELETE_USER_TRACKDAY_CALENDAR = gql`
  mutation deleteUserTrackdayCalendar(
    $trackdayId: ID!
  ) {
    deleteUserTrackdayCalendar(
      trackdayId: $trackdayId
    ) {
      id
      eventId
    }
  }
`
