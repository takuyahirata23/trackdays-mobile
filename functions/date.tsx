const dateFormat = new Intl.DateTimeFormat('en-US')

export const formatDate = (date: Date) => dateFormat.format(date)
