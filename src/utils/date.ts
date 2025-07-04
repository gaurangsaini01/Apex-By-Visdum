import dayjs from 'dayjs';

export const formatDate = (value:string) => {
  if (!value) return '';
  return dayjs(value).format('DD MMM YYYY, hh:mm A'); 
};
