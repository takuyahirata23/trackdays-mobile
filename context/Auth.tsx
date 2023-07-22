import React from 'react'

import { saveToken, deleteToken } from '@utils/secureStore'

type User = {
  email: string
  name: string
}

type SignInFields = {
  email: string
  password: string
}

type Props = {
  children: React.ReactNode
  setUser: (user: User | null) => void
}

type AuthContextType = {
  signIn: (form: SignInFields) => void
  signOut: () => void
  error: null | string
}

export const AuthContext = React.createContext<AuthContextType>({
  signIn: (_form: SignInFields) => {},
  signOut: () => {},
  error: null
})

const path = `${process.env.DOMAIN_URL}/auth/login`

const fetchUser = (body: SignInFields) =>
  fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

export function AuthProvider({ children, setUser }: Props) {
  const [error, setError] = React.useState<null | string>(null)

  const signIn = (body: SignInFields) =>
    fetchUser(body)
      .then(x => {
        if (x.status === 200) {
          return x.json()
        } else {
          throw new Error('There was a problem sigining in')
        }
      })
      .then(d => {
        saveToken(d.token)
        setError(null)
        setUser(d.user)
      })
      .catch(e => {
        console.error(e)
        setError('User not found. Please try again.')
      })

  const signOut = async () => {
    await deleteToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        error,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
