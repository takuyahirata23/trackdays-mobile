import React from 'react'

import {
  millisecondsToMinute,
  millisecondsToSeconds
} from '@functions/lapTimeConverters'

import type { TrackdayNote } from '@type/event'

type Props = {
  children: React.ReactNode
}

type Fields =
  | 'note'
  | 'facility'
  | 'track'
  | 'motorcycle'
  | 'minutes'
  | 'seconds'
  | 'milliseconds'

type TrackdayNoteContextType = {
  fields: { [key in Fields]: string }
  handleOnChange: (_field: Fields) => (_value: string, _name?: string) => void
  sync: (_v: TrackdayNote) => void
  reset: () => void
  names: {
    facility: string
    track: string
    motorcycle: string
  }
}

const timeToFields = (lapTime: number) => {
  if (!lapTime) {
    return { minutes: '', seconds: '0', milliseconds: '0' }
  } else {
    const minutes = millisecondsToMinute(lapTime)
    const [seconds, milliseconds] = millisecondsToSeconds(lapTime)
      .toFixed(3)
      .split('.')
    return {
      minutes: String(minutes),
      seconds,
      milliseconds: milliseconds.replaceAll('0', '')
    }
  }
}

const trackdayNoteToFields = ({
  track,
  motorcycle,
  lapTime,
  note = ''
}: TrackdayNote) => {
  return {
    track: track.id,
    motorcycle: motorcycle.id,
    note,
    facility: track.facility.id,
    ...timeToFields(lapTime || 0)
  }
}

const trackdayNoteToNames = ({ track, motorcycle }: TrackdayNote) => {
  return {
    track: track.name,
    motorcycle: `${motorcycle.model.make.name} ${motorcycle.model.name}`,
    facility: track.facility.name
  }
}

const iv = {
  note: '',
  facility: '',
  track: '',
  motorcycle: '',
  minutes: '',
  seconds: '',
  milliseconds: ''
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
    if (field === 'facility') {
      setFields(prev => ({ ...prev, facility: value, track: '' }))
      setNames(prev => ({ ...prev, facility: name as string, track: '' }))
    } else {
      setFields(prev => ({ ...prev, [field]: value }))
      if (name) {
        setNames(prev => ({ ...prev, [field]: name }))
      }
    }
  }

  const sync = (trackday: TrackdayNote) => {
    setFields(trackdayNoteToFields(trackday))
    setNames(trackdayNoteToNames(trackday))
  }

  const reset = () => {
    setFields(iv)
    setNames(namesInitialValue)
  }

  return (
    <TrackdayNoteFormContext.Provider
      value={{
        fields,
        sync,
        names,
        handleOnChange,
        reset
      }}
    >
      {children}
    </TrackdayNoteFormContext.Provider>
  )
}
