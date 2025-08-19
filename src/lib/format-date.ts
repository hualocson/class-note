import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = (date: Date) => {
  const localDate = dayjs(date).utc(true).toDate();
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(localDate);
};

export const formatServerDate = (date: string | Date) => {
  return dayjs(date).utc(true);
};

export default formatDate;
