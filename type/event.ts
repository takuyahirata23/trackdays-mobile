import type { Motorcycle } from './vehicle'

export type Trackday = {
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
}
