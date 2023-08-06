export type Make = {
  id: string
  name: string
}

export type Model = {
  id: string
  name: string
  make: Make
}

export type Motorcycle = {
  id: string
  year: string
  model: Model
}
