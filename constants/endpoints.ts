const BASE = `${process.env.EXPO_PUBLIC_DOMAIN_URL}`

export const AUTH = BASE.concat('/auth')

export const LOGIN = AUTH.concat('/login')
export const REGISTER = AUTH.concat('/register')
export const DELETE_ACCOUNT = AUTH.concat('/delete-account')
export const UPDATE_EMAIL = AUTH.concat('/update-email')
export const UPDATE_PASSWORD = AUTH.concat('/forgot-password')

export const IMAGES = BASE.concat('/images')
export const PROFILE_IMAGE = IMAGES.concat('/profile')
