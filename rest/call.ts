import { getToken } from 'utils/secureStore'

type Call = {
  path: string
  headers?: Record<string, string>
  body?: Record<string, string>
}

export const generateAuthHeader = async () => {
  const token = await getToken()
  return {
    authorization: token ? `Bearer ${token}` : ''
  }
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
