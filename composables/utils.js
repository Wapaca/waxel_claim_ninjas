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

export const precise = (num, precision) => {
  let additionalExposant = 0
  let numStr = num.toString();
  if (numStr.includes('e')) {
    const parts = numStr.split('e');
    additionalExposant = Number(parts[1])
    num = Number(parts[0])
  }

  const rounded = Number(Math.floor(num + "e" + precision) + "e-" + (precision-additionalExposant) )
  return rounded.toFixed(precision);
}

const formatDoubleDigit = (number) => {
  if(number < 10)
    return '0'+number

  return number
}
export const formatDurationSeconds = (seconds) => {
  let days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  let hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * 60 * 60;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  let formatted = ''
  if (days > 0) {
    formatted += `${days} day${days > 1 ? 's' : ''} `;
  }
  if (hours > 0) {
    formatted += `${formatDoubleDigit(hours)}:`;
  }
  if (minutes > 0) {
    formatted += `${formatDoubleDigit(minutes)}:`;
  }
  formatted += `${formatDoubleDigit(seconds)}`;

  return formatted;
}