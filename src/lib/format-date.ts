import dayjs from "@/configs/dayjs";

const formatDate = (date: Date) => {
  const localDate = dayjs(date).toDate();
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(localDate);
};

export const formatServerDate = (date: string | Date) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return dayjs.utc(date).tz(tz);
};

export default formatDate;
