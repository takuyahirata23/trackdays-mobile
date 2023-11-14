import React from 'react'

import { saveToken, deleteToken, getToken } from '@utils/secureStore'

type User = {
  email: string
  name: string
}

type SignInFields = {
  email: string
  password: string
}

type RegisterFields = {
  name: string
} & SignInFields

type Reponse = {
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

type AuthContextType = {
  signIn: (form: SignInFields) => void
  signOut: () => void
  deleteAccount: () => void,
  register: (form: RegisterFields) => void
  error: null | Error
}

export const AuthContext = React.createContext<AuthContextType>({
  signIn: (_form: SignInFields) => {},
  signOut: () => {},
  deleteAccount: () => {},
  register: (_from: RegisterFields) => {},
  error: null
})

const base = `${process.env.DOMAIN_URL}/auth/`
const loginPath = base.concat('login')
const registerPath = base.concat('register')
const deleteAccountPath = base.concat('delete-account')

const fetchUser = (path: string, body: SignInFields) =>
  fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(x => x.json())


export function AuthProvider({ children, setUser }: Props) {
  const [error, setError] = React.useState<null | Error>(null)

  const handleErrorFromAPI = (data: ErrorsFromAPI) => {
    setError({
      message: data.message,
      fields: data.errors
    })
  }

  const handleUserResponse = (d: { token: string; user: User }) => {
    saveToken(d.token)
    setError(null)
    setUser(d.user)
  }

  const handleResponse = (d: Reponse) =>
    d.error ? handleErrorFromAPI(d) : handleUserResponse(d)

  const signIn = (body: SignInFields) =>
    fetchUser(loginPath, body)
      .then(handleResponse)
      .catch(e => {
        console.error(e)
        setError({ message: 'User not found. Please try again.' })
      })

  const signOut = async () => {
    await deleteToken()
    setUser(null)
  }

  

  const deleteAccount = async () => {
    const token = await getToken()

    fetch(deleteAccountPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
    }).then(x => x.json()).then(() => {
       deleteToken()
       setUser(null)
    })
  }

  const register = (body: RegisterFields) =>
    fetchUser(registerPath, body)
      .then(handleResponse)
      .catch(e => {
        console.log(e)
        setError({ message: 'Registration failed. Please try again.' })
      })

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
