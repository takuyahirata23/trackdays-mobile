import { PROFILE_IMAGE } from '@constants/endpoints'
import { call, generateAuthHeader } from './call'

export const updateProfileImage = async (body: any) => {
  const headers = await generateAuthHeader()

  return call({
    path: PROFILE_IMAGE,
    headers: { ...headers, 'Content-Type': 'multipart/form-data' },
    body,
    stringify: true
  })
}
