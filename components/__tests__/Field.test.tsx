import React from 'react'
import { render, screen } from '@testing-library/react-native'

import { Field } from '../Field'

describe('Display error', () => {
  test('should render error message', () => {
    render(<Field label="Text" onChangeText={() => null} error="Error" />)
    const res = screen.getByText('Error')

    expect(res).toBeOnTheScreen()
  })

  test('should multiple errors when error is array', () => {
    const errors = ['E1', 'E2', 'Last']
    render(<Field label="Text" onChangeText={() => null} error={errors} />)

    errors.map(e => expect(screen.getByText(e)).toBeOnTheScreen())
  })
})
