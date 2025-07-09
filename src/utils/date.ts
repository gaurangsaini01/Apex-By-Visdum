import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// setting IST as default timezone
dayjs.tz.setDefault('Asia/Kolkata');

export const formatDate = (value: string) => {
  if (!value) return '';

  // converting UTC to IST
  return dayjs.utc(value).tz().format('DD MMM YYYY, hh:mm A');
};