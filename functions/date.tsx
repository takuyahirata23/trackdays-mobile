const dateFormat = new Intl.DateTimeFormat('en-CA')

export const formatDate = (date: Date) => dateFormat.format(date)
