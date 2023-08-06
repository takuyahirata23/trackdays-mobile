export type Make = {
  id: string
  name: string
}

export type Model = {
  id: string
  name: string
}

export type Motorcycle = {
  id: string
  year: string
  make: Make
  model: Model
}
