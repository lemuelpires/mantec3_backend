/*import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService {
  private app!: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(process.cwd(), 'src/config/mantec3-d7498-firebase-adminsdk-fbsvc-c210d1a3af.json');
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      this.app = admin.apps[0]!;
    }
  }

  getAuth(): admin.auth.Auth {
    return this.app.auth();
  }
}*/
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
