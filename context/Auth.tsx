import React from 'react'
import { useRouter } from 'expo-router'

import { saveToken, deleteToken } from '@utils/secureStore'
import {
  sendLoginRequest,
  sendRegisterRequest,
  sendDeleteAccountRequest
} from '@rest/auth'

import type { SignInFields, RegisterFields } from '@type/fields'

type User = {
  email: string
  name: string
}

type Response = {
  message: string
  errors?: { [key: string]: string[] }
  error: boolean
  user: User
  token: string
}

type Props = {
  children: React.ReactNode
  setUser: (user: User | null) => void
}

type Error = {
  message?: string
  fields?: { [key: string]: string[] }
}

type ErrorsFromAPI = {
  message: string
  errors?: { [key: string]: string[] }
  error: boolean
}

type ResponseCallback = (r: Response) => void

type AuthContextType = {
  signIn: (form: SignInFields) => void
  signOut: () => void
  deleteAccount: () => void
  register: (form: RegisterFields, callback: ResponseCallback) => void
  error: null | Error
}

export const AuthContext = React.createContext<AuthContextType>({
  signIn: (_form: SignInFields) => {},
  signOut: () => {},
  deleteAccount: () => {},
  register: (_from: RegisterFields) => {},
  error: null
})

export function AuthProvider({ children, setUser }: Props) {
  const [error, setError] = React.useState<null | Error>(null)
  const { replace } = useRouter()

  const handleErrorFromAPI = (data: ErrorsFromAPI) => {
    setError({
      message: data.message,
      fields: data.errors
    })
  }

  const handleUserLoginResponse = (d: { token: string; user: User }) => {
    saveToken(d.token)
    setError(null)
    setUser(d.user)
  }

  const handleUserRegistrationResponse = () => replace('/sign-in')

  const handleResponse = (cb: (_d: Response) => void) => (d: Response) =>
    d.error ? handleErrorFromAPI(d) : cb(d)

  const signIn = (body: SignInFields) =>
    sendLoginRequest(body)
      .then(handleResponse(handleUserLoginResponse))
      .catch(e => {
        setError({ message: 'User not found. Please try again.' })
      })

  const signOut = async () => {
    await deleteToken()
    setUser(null)
  }

  const deleteAccount = () => {
    sendDeleteAccountRequest()
      .then(deleteToken)
      .then(() => setUser(null))
  }

  const register = (body: RegisterFields, callback: (r: Response) => void) => {
    sendRegisterRequest({ ...body, group_id: body.groupId })
      .then(callback)
      .catch(() => {
        setError({ message: 'Registration failed. Please try again later.' })
      })
  }

  return (
    <AuthContext.Provider
      value={{
        error,
        signIn,
        signOut,
        deleteAccount,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
