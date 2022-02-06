import * as dayjs from "dayjs";
import { BaseFirestoreDateAdapter, Timestamp } from "../common";

export abstract class FirestoreDayJsAdapter extends BaseFirestoreDateAdapter<dayjs.Dayjs> {
  isDate(v: any): v is dayjs.Dayjs {
    return dayjs.isDayjs(v);
  }

  fromTimestampToDate(timestamp: Timestamp): dayjs.Dayjs {
    return dayjs(timestamp.toDate());
  }

  fromDateToTimestamp(date: dayjs.Dayjs): Timestamp {
    return this.Timestamp.fromDate(date.toDate());
  }
}
