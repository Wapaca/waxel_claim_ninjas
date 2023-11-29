export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const parseDateFromSmartcontract = (string) => {
  //2022-08-13T08:22:14.500
  
  // separate date from hours
  let split = string.split('T')
  const YearMonthDay = split[0].split('-')
  // separate milliseconds
  split = split[1].split('.')
  const Ms = (split.length > 1) ? split[1] : 0
  const HoursMinutesSeconds = split[0].split(':')
  let d = new Date();
  d.setUTCFullYear(YearMonthDay[0])
  d.setUTCMonth(YearMonthDay[1]-1)
  d.setUTCDate(YearMonthDay[2])
  d.setUTCHours(HoursMinutesSeconds[0], HoursMinutesSeconds[1], HoursMinutesSeconds[2], Ms)

  return d
}