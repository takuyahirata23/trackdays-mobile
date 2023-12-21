export const millisecondsToMinute = (x: number) => Math.floor(x / 60000)
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

export const lapTimeToMilliseconds = ({
  minutes,
  seconds,
  milliseconds
}: Record<string, string>) =>
  minutesToMilliseconds(Number(minutes)) +
  secondsToMilliseconds(Number(seconds)) +
  Number(milliseconds)

export const formatLapTime = (lapTimeInMilliseconds: number) =>
  `${millisecondsToMinute(lapTimeInMilliseconds)}:${millisecondsToSeconds(
    lapTimeInMilliseconds
  ).toFixed(3)}`
