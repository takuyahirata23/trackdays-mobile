import type { Motorcycle } from './vehicle'
import type { Organization } from './business'
import type { Track } from './park'

export type TrackdayNote = {
  id: string
  date: string
  lapTime?: number
  track: {
    id: string
    name: string
    length: number
    facility: {
      id: string
      name: string
    }
  }
  motorcycle: Motorcycle
  note?: string
}

export type Trackday = {
  id: string
  date: string
  price: number
  organization: Organization
  track: Track
}
