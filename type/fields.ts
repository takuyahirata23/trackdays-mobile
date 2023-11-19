export type SignInFields = {
  email: string
  password: string
}

export type RegisterFields = {
  name: string
} & SignInFields
