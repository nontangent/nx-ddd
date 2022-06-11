import { Injectable, Module } from "@nestjs/common";
import { AdminFirestoreAdapter } from "../admin";
import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';


@Injectable()
export class NestFirestoreAdapter extends AdminFirestoreAdapter {
  constructor(nestFirestore: FirebaseFirestoreService) {
    super(nestFirestore.firestore);
  }
}

@Module({
  providers: [NestFirestoreAdapter],
  exports: [NestFirestoreAdapter],
})
export class NxDDDFirestoreAdapterModule { }
