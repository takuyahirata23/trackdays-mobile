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
  setMotorcycle: any,
  reset: () => void
}

export const MotorcycleFormContext = React.createContext({} as MotorcycleFormContextType)

const iv = {
    year: '',
    make: '',
    model: ''
  }

export function MotorcycleFormProvider({ children }: Props) {
  const [fields, setFields] = React.useState<Fields>(iv)
  const [motorcycle, setMotorcycle] = React.useState<Motorcycle>({
    make: '',
    model: ''
  })

  const handleOnChange = (field: Field) => (value: string) => {
    setFields(prev => ({ ...prev, [field]: value }))
  }

  const reset = () => {
    setFields(iv)
    setMotorcycle({make: '', model: ''})
  }

  const value = {
    fields,
    handleOnChange,
    motorcycle,
    setMotorcycle,
    reset
  }

  return (
    <MotorcycleFormContext.Provider value={value}>
      {children}
    </MotorcycleFormContext.Provider>
  )
}
