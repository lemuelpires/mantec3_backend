import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private app!: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } else {
      this.app = admin.apps[0]!;
    }
  }

  getAuth(): admin.auth.Auth {
    return this.app.auth();
  }
}
