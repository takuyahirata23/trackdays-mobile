import * as SecureStore from 'expo-secure-store'

export const getToken = () => SecureStore.getItemAsync('token')

export const saveToken = (token: string) =>
  SecureStore.setItemAsync('token', token)

export const deleteToken = () => SecureStore.deleteItemAsync('token')

export const getCalendarId = () => SecureStore.getItemAsync('calendarId')
export const setCalendarId = (calendarId: string) =>
  SecureStore.setItemAsync('calendarId', calendarId)
