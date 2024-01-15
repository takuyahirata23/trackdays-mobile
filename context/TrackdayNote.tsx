import React from 'react'

type Props = {
  children: React.ReactNode
}

type TrackdayNoteContextType = {
  trackdayNote: { note: string }
  updateTrackdayNote: (_field: string) => (_value: string) => void,
  reset: () => void
}

const iv = {
  note: ''
}

export const TrackdayNoteContext = React.createContext({
  trackdayNote: { note: '' }
} as TrackdayNoteContextType)

export function TrackdayNoteProvider({ children }: Props) {
  const [trackdayNote, setTrackdayNote] = React.useState(iv)

  const updateTrackdayNote = (field: string) => (value: string) =>
    setTrackdayNote(prev => ({ ...prev, [field]: value }))

  const reset = () => setTrackdayNote(iv)

  return (
    <TrackdayNoteContext.Provider
      value={{
        trackdayNote,
        updateTrackdayNote,
        reset
      }}
    >
      {children}
    </TrackdayNoteContext.Provider>
  )
}
