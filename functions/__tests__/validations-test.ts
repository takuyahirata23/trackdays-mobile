import { Predicate } from 'fts-utils'
import {
  isValidYearFormat,
  motorcycleValidations,
  validateMinLength,
  isEmail,
  runValidations
} from '../validations'

describe('validations', () => {
  test.each(['hello', 'my name', '', ' hello89 '])(
    'should return false if value does not have enough length',
    value => {
      expect(validateMinLength(8)(value)).toBeFalsy()
    }
  )

  test.each(['hello world', 'my name is joe', ' username hi  '])(
    'should return ture if value has enough length',
    value => {
      expect(validateMinLength(8)(value)).toBeTruthy()
    }
  )

  test.each(['noemail@test.hello', 'hello.ca', '@', 'novalid@ca'])(
    'should return false when email format is not valid',
    email => {
      expect(isEmail(email)).toBeFalsy()
    }
  )

  test.each(['valid@test.com', 'hello@domain.ca', 'myemail-yo@track.jp'])(
    'should return false when email format is not valid',
    email => {
      expect(isEmail(email)).toBeTruthy()
    }
  )

  test('should return false when year is not valid format', () => {
    expect(isValidYearFormat('hello')).toBeFalsy()
  })

  test('should return true when year is valid format', () => {
    expect(isValidYearFormat('1234')).toBeTruthy()
  })
})

describe('runValidations', () => {
  const genPredicates = (length: number) => ({
    name: Predicate(validateMinLength(length)),
    username: Predicate(validateMinLength(length))
  })

  test('should return error form with the flag true', () => {
    const result = runValidations(genPredicates(6))({
      name: 'Jon Doe',
      username: 'username'
    })
    expect(result.isValid).toBeTruthy()
    expect(result).not.toHaveProperty('name')
    expect(result).not.toHaveProperty('username')
  })

  test('should return error form with the flag false and error message', () => {
    const result = runValidations(genPredicates(7))({
      name: 'valid name',
      username: 'short'
    })

    expect(result.isValid).toBeFalsy()
    expect(result).not.toHaveProperty('name')
    expect(result).toHaveProperty('username', 'validationErroMessages.username')
  })
})

describe('motorcycle registration validations', () => {
  test('should return false if year is not valid', () => {
    expect(motorcycleValidations.year.run('1780')).toBeFalsy()
  })

  test('should return true if year is not valid', () => {
    expect(motorcycleValidations.year.run('1800')).toBeTruthy()
  })
})
