import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { FirebaseAuthGuard } from './auth/firebase/firebase.guard';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getConnectionToken(),
          useValue: { readyState: 1 },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should report liveness', () => {
      expect(appController.live()).toMatchObject({
        status: 'ok',
      });
    });

    it('should report readiness', () => {
      expect(appController.ready()).toMatchObject({
        status: 'ok',
        database: 'connected',
      });
    });
  });

  describe('secure', () => {
    it('should return authenticated user data', () => {
      const req = { user: { uid: 'user-1', email: 'user@example.com' } };

      expect(appController.secure(req)).toEqual({
        uid: 'user-1',
        email: 'user@example.com',
      });
    });
  });
});
