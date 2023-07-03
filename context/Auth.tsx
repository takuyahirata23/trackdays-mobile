import React from 'react'

import { saveToken } from '@utils/secureStore'

type User = {
  email: string
  name: string
}

export const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {}
})

type Props = {
  children: React.ReactNode
  setUser: (user: User | null) => void
}

const path = `${process.env.DOMAIN_URL}/auth/login`

const body = JSON.stringify({ email: 'admin@test.com', password: 'Pass1234!' })

const fetchUser = () =>
  fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })

export function AuthProvider({ children, setUser }: Props) {
  const signIn = () =>
    fetchUser()
      .then(x => x.json())
      .then(d => {
        saveToken(d.token)
        setUser(d.user)
      })
      .catch(console.error)

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
