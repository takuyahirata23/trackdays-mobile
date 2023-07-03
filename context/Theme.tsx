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
    primary: '#0f172a',
    secondary: '#94a3b8',
    tertiary: '#deff26',
    bgPrimary: '#ffffff',
    bgSecondary: '#1e293b',
    btnPrimary: '#0ea5e9',
    btnSecondary: '#334155'
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme()
  return (
    <TP value={colorScheme === 'dark' ? DarkTheme : LightTheme}>{children}</TP>
  )
}
