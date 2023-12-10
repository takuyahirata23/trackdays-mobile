import {
  UPDATE_EMAIL,
  LOGIN,
  REGISTER,
  DELETE_ACCOUNT,
  UPDATE_PASSWORD
} from '@constants/endpoints'
import { call, generateAuthHeader } from './call'

import type { SignInFields, RestRegisterFields } from '@type/fields'

export const sendLoginRequest = (body: SignInFields) =>
  call({ path: LOGIN, body })
export const sendRegisterRequest = (body: RestRegisterFields) =>
  call({ path: REGISTER, body })

export const sendDeleteAccountRequest = async () => {
  const headers = await generateAuthHeader()
  call({ path: DELETE_ACCOUNT, headers })
}

export const sendEmailUpdateRequest = async (body: { email: string }) => {
  const headers = await generateAuthHeader()

  return call({ path: UPDATE_EMAIL, headers, body })
}

export const sendPasswordUpdateRequest = async (body: { email: string }) => {
  return call({ path: UPDATE_PASSWORD, body })
}
