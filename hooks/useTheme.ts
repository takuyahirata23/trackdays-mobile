import { useTheme as useThmeFormReactNavigation } from '@react-navigation/native'
import type { Theme } from '@context/Theme'

export function useTheme() {
  return useThmeFormReactNavigation() as Theme
}
