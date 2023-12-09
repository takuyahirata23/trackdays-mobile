import { Predicate } from 'fts-utils'
import { reduce } from 'ramda'

import type { Predicate as P } from 'fts-utils'

type Predicates = { [key: string]: P }
type Form = { [key: string]: string }

export const validateMinLength =
  (minLength: number = 1) =>
  (x: string) =>
    x.trim().length >= minLength

export const isEmail = (email: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)

export const isValidYearFormat = (year: string) => /^[\d]{4}/.test(year)

export const moreThanAvaialbeYear = (year: string) =>
  Number(year) >= 1800 && Number(year) <= new Date().getFullYear()

export const isValidLaptimeValue = (limit: number) => (minutes: string) =>
  Number(minutes) <= limit

const signInValidations = {
  email: Predicate(isEmail),
  password: Predicate(validateMinLength(4))
}

const registerValidation = {
  name: Predicate(validateMinLength(2)),
  email: Predicate(isEmail),
  password: Predicate(validateMinLength(4))
}

const emailValidation = {
  email: Predicate(isEmail)
}

export const motorcycleValidations = {
  year: Predicate(isValidYearFormat).concat(Predicate(moreThanAvaialbeYear))
}

export const trackdayNoteValidations = {
  date: Predicate(validateMinLength(8)),
  track: Predicate(validateMinLength(5)),
  motorcycle: Predicate(validateMinLength(5)),
  minutes: Predicate(isValidLaptimeValue(5)),
  seconds: Predicate(isValidLaptimeValue(60)),
  milliseconds: Predicate(isValidLaptimeValue(999))
}

export const runValidations = (predicates: Predicates) => (form: Form) =>
  reduce(
    (acc, [key, value]) =>
      predicates[key].run(value)
        ? acc
        : { ...acc, isValid: false, [key]: `validationErroMessages.${key}` },
    { isValid: true },
    Object.entries(form)
  )

export const validateSignInForm = runValidations(signInValidations)
export const validateRegisterForm = runValidations(registerValidation)
export const validateEmailForm = runValidations(emailValidation)
export const validateTrackdayNote = runValidations(trackdayNoteValidations)
