import { Predicate } from 'fts-utils'
import { reduce } from 'ramda'

import type { Predicate as P } from 'fts-utils'

type Predicates = { [key: string]: P }
type Form = { [key: string]: string }

const validateMinLength =
  (minLength: number = 1) =>
  (x: string) =>
    x.trim().length >= minLength

export const isEmail = (email: string) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

const signInValidations = {
  email: Predicate(isEmail),
  password: Predicate(validateMinLength(4))
}

const runValidations = (predicates: Predicates) => (form: Form) =>
  reduce(
    (acc, [key, value]) =>
      predicates[key].run(value)
        ? acc
        : { ...acc, isValid: false, [key]: `validationErroMessages.${key}` },
    { isValid: true },
    Object.entries(form)
  )

export const validateSignInForm = runValidations(signInValidations)
