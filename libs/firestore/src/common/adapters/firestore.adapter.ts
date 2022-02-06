import { CommonFirestoreCollection, CommonFirestoreCollectionGroup, CommonFirestoreDocument } from "../interfaces";

export interface FirestoreAdapter {
  doc: <Data>(path: string) => CommonFirestoreDocument<Data>;
  collection: <Data>(path: string) => CommonFirestoreCollection<Data>;
  collectionGroup: <Data>(path: string) => CommonFirestoreCollectionGroup<Data>;
}
