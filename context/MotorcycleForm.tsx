import React from 'react'

type Props = {
  children: React.ReactNode
}

export type Field = 'year' | 'make' | 'model'

export type Fields = {
  year: string
  make: string
  model: string
}

export type Motorcycle = {
  make: string
  model: string
}

type MotorcycleFormContextType = {
  fields: Fields,
  motorcycle: Motorcycle,
  handleOnChange: (_f: Field) => (_value: string) => void
  setMotorcycle: any 
}

export const MotorcycleFormContext = React.createContext({} as MotorcycleFormContextType)

export function MotorcycleFormProvider({ children }: Props) {
  const [fields, setFields] = React.useState<Fields>({
    year: '',
    make: '',
    model: ''
  })
  const [motorcycle, setMotorcycle] = React.useState<Motorcycle>({
    make: '',
    model: ''
  })

  const handleOnChange = (field: Field) => (value: string) => {
    setFields(prev => ({ ...prev, [field]: value }))
  }

  const value = {
    fields,
    handleOnChange,
    motorcycle,
    setMotorcycle
  }

  return (
    <MotorcycleFormContext.Provider value={value}>
      {children}
    </MotorcycleFormContext.Provider>
  )
}
