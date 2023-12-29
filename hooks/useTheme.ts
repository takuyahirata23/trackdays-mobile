import { useTheme as useThemeFormReactNavigation } from '@react-navigation/native'
import type { Theme } from '@context/Theme'

export function useTheme() {
  return useThemeFormReactNavigation() as Theme
}
