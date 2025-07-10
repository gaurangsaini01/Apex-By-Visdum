import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

// setting IST as default timezone
dayjs.tz.setDefault('Asia/Kolkata');

export const formatDate = (value: string) => {
  if (!value) return '';

  // converting UTC to IST
  return dayjs.utc(value).tz().format('DD MMM YYYY, hh:mm A');
};



export const formatSecondsToHHMMSS = (seconds: number): string => {
  const dur = dayjs.duration(seconds, 'seconds');
  const h = String(dur.hours()).padStart(2, '0');
  const m = String(dur.minutes()).padStart(2, '0');
  const s = String(dur.seconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const convertTimeToIST = (timeStr: string): string => {
  if (!timeStr) return '';

  const utcDateTime = dayjs.utc(`1970-01-01T${timeStr}:00Z`); // UTC base time
  const istDateTime = utcDateTime.tz(); // Converts to Asia/Kolkata due to setDefault

  return istDateTime.format('HH:mm A'); // You can also return 'hh:mm A' for AM/PM
};

