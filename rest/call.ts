import { getToken } from 'utils/secureStore'

type Call = {
  path: string
  headers?: Record<string, string>
  body?: Record<string, string>
  stringify?: boolean
}

export const generateAuthHeader = async () => {
  const token = await getToken()
  return {
    authorization: token ? `Bearer ${token}` : ''
  }
}

export const call = ({ path, headers = {}, body = {}, stringify = true }: Call) =>  
   fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: (stringify ? JSON.stringify(body) : body) as string
  }).then(x => x.json())
