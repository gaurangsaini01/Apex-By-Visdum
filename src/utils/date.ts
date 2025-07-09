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
