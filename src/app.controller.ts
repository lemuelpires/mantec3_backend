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
import { FirebaseAuthGuard } from './auth/firebase/firebase.guard';

@Controller()
export class AppController {

  @UseGuards(FirebaseAuthGuard)
  @Get('secure')
  secure(@Req() req) {
    return {
      uid: req.user.uid,
      email: req.user.email,
    };
  }
}
