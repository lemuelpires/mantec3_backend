import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseAuthGuard } from './firebase/firebase.guard';

@Global()
@Module({
  providers: [FirebaseService, FirebaseAuthGuard],
  exports: [FirebaseService, FirebaseAuthGuard],
})
export class AuthModule {}
