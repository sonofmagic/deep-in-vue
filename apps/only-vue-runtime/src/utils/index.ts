import dayjs from 'dayjs'

/**
 * 使程序暂停指定的时间
 * @param ms 暂停的时间，单位是毫秒
 * @returns 一个 Promise，在指定时间后 resolve
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 使程序暂停一个随机的时间
 * @param min 最小时间，单位是毫秒
 * @param max 最大时间，单位是毫秒
 * @returns 一个 Promise，在随机时间后 resolve
 */
export function sleepRandom(min: number = 200, max: number = 800): Promise<void> {
  const randomMs = Math.floor(Math.random() * (max - min + 1)) + min
  return sleep(randomMs)
}

export function formatDate(ts: dayjs.ConfigType) {
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}
