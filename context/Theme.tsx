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
    text: string
    border: string
    notification: string
    secondary: string
    tertiary: string
    error: string
    bgPrimary: string
    bgSecondary: string
    btnPrimary: string
    btnSecondary: string
  }
}

const DarkTheme: Theme = {
  ...DT,
  colors: {
    ...DT.colors,
    primary: '#ffffff',
    secondary: '#94a3b8',
    tertiary: '#deff26',
    error: '#FF3333',
    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    btnPrimary: '#0ea5e9',
    btnSecondary: '#334155'
  }
}

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#4d4b4a',
    background: '#ffffff',
    primary: '#4d4b4a',
    secondary: '#304fff',
    tertiary: '#1012a3',
    error: '#FF3333',
    bgPrimary: '#f9f9fb',
    bgSecondary: '#f2f2f2',
    btnPrimary: '#ffd000',
    btnSecondary: '#334155'
  }
}
//Box shadow
//0 2px 6px 0 rgba(27,27,34,.2)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme()
  return (
    <TP value={colorScheme === 'dark' ? DarkTheme : LightTheme}>{children}</TP>
  )
}
