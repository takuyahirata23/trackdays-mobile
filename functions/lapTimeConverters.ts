export const millisecondsToMinute = (x: number) => x / 1000 / 60
export const millisecondsToSeconds = (x: number) => (x / 1000) % 60
export const minutesToMilliseconds = (minute: number) => minute * 60000
export const secondsToMilliseconds = (seconds: number) => seconds * 1000

export const formatLapTime = (lapTimeInMilliseconds: number) =>
  `${millisecondsToMinute(lapTimeInMilliseconds).toFixed(
    0
  )}:${millisecondsToSeconds(lapTimeInMilliseconds).toFixed(3)}`
