const BASE = `${process.env.DOMAIN_URL}`

export const AUTH = BASE.concat('/auth')

export const LOGIN = AUTH.concat('/login')
export const REGISTER = AUTH.concat('/register')
export const DELETE_ACCOUNT = AUTH.concat('/delete-account')
export const UPDATE_EMAIL = AUTH.concat('/update-email')
