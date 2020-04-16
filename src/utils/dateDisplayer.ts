import {Dayjs} from "dayjs";


export default (date: Dayjs) => date.isToday() ? 'Today' : date.isYesterday() ? 'Yesterday' :  `${date.date()}/${date.month()}/${date.year()}`
export const timeDisplayer =  (date: Dayjs) => date.isToday() ?  date.fromNow() : `${date.hour()}:${date.minute()}`
