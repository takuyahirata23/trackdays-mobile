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

type RegisterFields = {
  name: string
} & SignInFields

type Props = {
  children: React.ReactNode
  setUser: (user: User | null) => void
}

type Error = {
  message?: string
  fields?: { [key: string]: string[] }
}

type AuthContextType = {
  signIn: (form: SignInFields) => void
  signOut: () => void
  register: (form: RegisterFields) => void
  error: null | Error
}

export const AuthContext = React.createContext<AuthContextType>({
  signIn: (_form: SignInFields) => {},
  signOut: () => {},
  register: (_from: RegisterFields) => {},
  error: null
})

const base = `${process.env.DOMAIN_URL}/auth/`
const loginPath = base.concat('login')
const registerPath = base.concat('register')

const fetchUser = (path: string, body: SignInFields) =>
  fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

export function AuthProvider({ children, setUser }: Props) {
  const [error, setError] = React.useState<null | Error>(null)

  const signIn = (body: SignInFields) =>
    fetchUser(loginPath, body)
      .then(x => {
        return x.json()
      })
      .then(d => {
        if (d.error) {
          setError({
            message: d.message,
            fields: d.errors
          })
        } else {
          saveToken(d.token)
          setError(null)
          setUser(d.user)
        }
      })
      .catch(e => {
        console.error(e)
        setError({ message: 'User not found. Please try again.' })
      })

  const signOut = async () => {
    await deleteToken()
    setUser(null)
  }

  const register = (body: RegisterFields) =>
    fetchUser(registerPath, body)
      .then(x => {
        return x.json()
      })
      .then(d => {
        if (!d.error) {
          saveToken(d.token)
          setError(null)
          setUser(d.user)
        } else {
          setError({
            message: d.message,
            fields: d.errors
          })
        }
      })
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
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
