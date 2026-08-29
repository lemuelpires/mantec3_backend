/*import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}*/

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { FirebaseAuthGuard } from './auth/firebase/firebase.guard';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Public()
  @Get('health/live')
  live() {
    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health/ready')
  ready() {
    const databaseReady = this.connection.readyState === 1;

    return {
      status: databaseReady ? 'ok' : 'degraded',
      database: databaseReady ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @UseGuards(FirebaseAuthGuard)
  @Get('secure')
  secure(@Req() req) {
    return {
      uid: req.user.uid,
      email: req.user.email,
    };
  }
}
