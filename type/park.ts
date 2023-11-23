export type Facility = {
  id: string
  name: string
  description?: string
}

export type Track = {
  id: string
  name: string
  length: number
  facility: Facility
}
