import { isValidYearFormat, motorcycleValidations } from '../validations'

describe('motorcycle registration validations', () => {
  test('should return false when year is not valid format', () => {
    expect(isValidYearFormat('hello')).toBeFalsy()
  })

  test('should return true when year is valid format', () => {
    expect(isValidYearFormat('1234')).toBeTruthy()
  })

  test('should return false if year is not valid', () => {
    expect(motorcycleValidations.year.run('1780')).toBeFalsy()
  })

  test('should return true if year is not valid', () => {
    expect(motorcycleValidations.year.run('1800')).toBeTruthy()
  })
})
