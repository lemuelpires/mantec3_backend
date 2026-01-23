import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não informado');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);

      request.user = decoded; // uid, email, claims
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
