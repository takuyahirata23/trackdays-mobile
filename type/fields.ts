export type SignInFields = {
  email: string
  password: string
}

export type RegisterFields = {
  name: string
  groupId: string
} & SignInFields

export type RestRegisterFields = {
  name: string
  group_id: string
} & SignInFields
