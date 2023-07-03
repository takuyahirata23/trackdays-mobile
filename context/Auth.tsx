import React from 'react'

import { useProtectRoute } from '../hooks/useProtectRoute'

const AuthContext = React.createContext({
  user: null,
  signIn: () => {},
  signOut: () => {}
})

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = React.useState(null)

  useProtectRoute(user)

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: () => setUser(null),
        signOut: () => setUser(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
