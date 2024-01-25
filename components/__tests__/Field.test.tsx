import React from 'react'
import { render, screen } from '@testing-library/react-native'

import { Field } from '../Field'

describe('handle error', () => {
  test('should render error message', () => {
    render(<Field label="Text" onChangeText={() => null} error="Error" />)
    const res = screen.getByText('Error')

    expect(res).toBeOnTheScreen()
  })
})
