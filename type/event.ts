import type { Motorcycle } from './vehicle'
import type { Organization } from './business'
import type { Track } from './park'
import type { Group, User } from './accounts'

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
  startDatetime: string
  endDatetime: string
  price: number
  organization: Organization
  track: Track
}

export type AverageLapTime = {
  group: Group
  averageLapTime: number
}

export type LeaderboardItem = {
  user: User
  motorcycle: Motorcycle
  time: number
}
