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
