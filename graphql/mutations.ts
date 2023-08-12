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
