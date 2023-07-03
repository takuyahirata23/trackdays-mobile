import React from 'react'
import { useRouter, useSegments } from 'expo-router'

export function useProtectRoute(user: null & object) {
  const segments = useSegments()
  const router = useRouter()

  React.useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'
    if (!user && !inAuthGroup) {
      router.replace('/sign-in')
    } else if (user && inAuthGroup) {
      router.replace('/')
    }
  }, [user, segments])
}
