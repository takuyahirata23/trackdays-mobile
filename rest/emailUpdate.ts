import { getToken } from 'utils/secureStore'
import { UPDATE_EMAIL } from '@constants/endpoints'

type Call = {
  path: string
  headers?: Record<string, string>
  body?: Record<string, string>
}

export const call = ({ path, headers = {}, body = {} }: Call) =>
  fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body)
  }).then(x => x.json())

export const sendEmailUpdateRequest = async (body: { email: string }) => {
  const token = await getToken()
  const headers = {
    authorization: token ? `Bearer ${token}` : ''
  }

  return call({ path: UPDATE_EMAIL, headers, body })
}
