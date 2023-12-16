import React from 'react'
import { useColorScheme } from 'react-native'
import {
  ThemeProvider as TP,
  DarkTheme as DT,
  DefaultTheme
} from '@react-navigation/native'

export type Theme = {
  dark: boolean
  colors: {
    primary: string
    background: string
    card: string
    subcard: string
    text: string
    border: string
    notification: string
    secondary: string
    tertiary: string
    accent: string
    error: string
    bgPrimary: string
    bgSecondary: string
    btnPrimary: string
    btnSecondary: string
    btnBgPrimary: string
    btnBgSecondary: string
  }
}

// const DarkTheme: Theme = {
//   ...DT,
//   colors: {
//     ...DT.colors,
//     primary: '#ffffff',
//     secondary: '#94a3b8',
//     tertiary: '#deff26',
//     error: '#FF3333',
//     card: '#ffffff',
//     subcard: '#ffffff',
//     bgPrimary: '#0f172a',
//     bgSecondary: '#1e293b',
//     btnPrimary: '#0ea5e9',
//     btnSecondary: '#334155',
//     btnBgPrimary: '#0ea5e9',
//     btnBgSecondary: '#334155'
//   }
// }

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#4d4b4a',
    background: '#ffffff',
    primary: '#4d4b4a',
    secondary: '#6d6e71',
    tertiary: '#ff8c42',
    accent: '#279B47',
    error: '#f06543',
    card: '#ffffff',
    subcard: '#f9f9fb',
    bgPrimary: '#f9f9fb',
    bgSecondary: '#f2f2f2',
    btnPrimary: '#ffffff',
    btnSecondary: '#279B47',
    btnBgPrimary: '#279B47',
    btnBgSecondary: '#fce762'
  }
}
//Box shadow
//0 2px 6px 0 rgba(27,27,34,.2)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <TP value={LightTheme}>{children}</TP>
  )
}
