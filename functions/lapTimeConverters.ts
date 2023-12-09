export const millisecondsToMinute = (x: number) => x / 1000 / 60
export const millisecondsToSeconds = (x: number) => (x / 1000) % 60
export const minutesToMilliseconds = (minute: number) => minute * 60000
export const secondsToMilliseconds = (seconds: number) => seconds * 1000

export const formatMilliseconds = (x: string) => {
  const value = Number(x)
  if (value === 0) {
    return value
  } else if (value <= 9) {
    return value * 100
  } else if (value <= 99) {
    return value * 10
  } else {
    return value
  }
}

export const formatLapTime = (lapTimeInMilliseconds: number) =>
  `${millisecondsToMinute(lapTimeInMilliseconds).toFixed(
    0
  )}:${millisecondsToSeconds(lapTimeInMilliseconds)
    .toFixed(3)
    .replace('.', ':')}`
