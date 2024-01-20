import React from 'react'

type Props = {
  children: React.ReactNode
}

type Fields = 'note' | 'facility'

type TrackdayNoteContextType = {
  fields: { note: string; facility: string }
  handleOnChange: (_field: Fields) => (_value: string, _name?: string) => void
  reset: () => void
  names: {
    facility: string
    track: string
    motorcycle: string
  }
}

// const iv = {
//   note: '',
//   motorcycle: '',
//   facility: '',
//   track: '',
//   minutes: '',
//   seconds: '',
//   milliseconds: ''
// }
const iv = {
  note: '',
  facility: ''
}

const namesInitialValue = {
  facility: '',
  track: '',
  motorcycle: ''
}

export const TrackdayNoteFormContext = React.createContext(
  {} as TrackdayNoteContextType
)

export function TrackdayNoteFormProvider({ children }: Props) {
  const [fields, setFields] = React.useState(iv)
  const [names, setNames] = React.useState(namesInitialValue)

  const handleOnChange = (field: Fields) => (value: string, name?: string) => {
    setFields(prev => ({ ...prev, [field]: value }))
    if (name) {
      setNames(prev => ({ ...prev, [field]: name }))
    }
  }

  const reset = () => setFields(iv)

  return (
    <TrackdayNoteFormContext.Provider
      value={{
        fields,
        names,
        handleOnChange,
        reset
      }}
    >
      {children}
    </TrackdayNoteFormContext.Provider>
  )
}
