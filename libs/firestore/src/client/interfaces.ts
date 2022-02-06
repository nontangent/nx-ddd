import * as dayjs from 'dayjs';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;

export type FirestoreData<T> = {[K in keyof T]: T[K] extends dayjs.Dayjs ? Timestamp | FieldValue : T[K]};
export type _FirestoreData<T, K extends keyof T> = FirestoreData<Pick<T, K>>;
