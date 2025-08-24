import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(weekday);

export default dayjs;
