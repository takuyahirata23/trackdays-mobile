import { gql } from '@apollo/client'

export const MOTORCYCLE = gql`
  fragment NewMotorcycle on Motorcycle {
    id
    year
    model
    make
  }
`
