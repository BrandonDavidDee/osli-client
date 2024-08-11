import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);

const customDateFormat = 'YYYY-MM-DD';
const customDateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';
const customTimeFormat = 'HH:mm:ss';

const dateOutputFormat = 'M/D/YYYY';
const dateOutputFormatAlt = 'ddd M/D/YYYY';
const dateTimeOutputFormat = 'M/D/YYYY h:mm a';
const timeOutputFormat = 'h:mm A';

// date only functions:
export const getDateObject = (v: string) => {
  if (!v) {
    throw new Error('No Date String Supplied!');
  }
  if (v.length !== 10) {
    throw new Error(`Incorrect Format. Must be: ${customDateFormat}`);
  }
  return dayjs(v, customDateFormat);
};

export const getDateDisplay = (v: string | undefined | null) => {
  if (!v) { return ''; }
  const dateObject = getDateObject(v);
  return dateObject.format(dateOutputFormat);
};

export const getDateDisplayAlt = (v: string) => {
  if (!v) { return ''; }
  const dateObject = getDateObject(v);
  return dateObject.format(dateOutputFormatAlt);
};

// datetime functions:
export const getDateTimeObject = (v: string) => {
  if (!v) {
    throw new Error('No DateTime String Supplied!');
  }
  if (v.length < 19) {
    throw new Error(`Incorrect Format. Must be: ${customDateTimeFormat}`);
  }
  const truncatedDateTime = v.slice(0, 19);
  // pydantic json serialization results in these two formats:
  // 2023-09-14T20:23:46.640000, 2023-09-22T15:46:57
  // so we just cut off the microseconds value since we don't need it.
  const utcDate = dayjs.utc(truncatedDateTime, customDateTimeFormat);
  return utcDate.local();
};

export const getDateTimeDisplay = (v: string | undefined | null) => {
  if (!v) { return ''; }
  const localDateObj = getDateTimeObject(v);
  return localDateObj.format(dateTimeOutputFormat);
};

// time only functions
export const getTimeObject = (v: string) => {
  if (!v) {
    throw new Error('No Time String Supplied!');
  }
  if (v.length !== 8) {
    throw new Error(`Incorrect Format. Must be: ${customTimeFormat}`);
  }
  return dayjs(v, customTimeFormat);
};

export const getTimeDisplay = (v: string) => {
  if (!v) { return ''; }
  const timeObject = getTimeObject(v);
  return timeObject.format(timeOutputFormat);
};
