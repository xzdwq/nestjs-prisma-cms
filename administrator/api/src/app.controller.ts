import { Controller, Get, Req } from '@nestjs/common';

import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from '@/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get()
  public getHello(@Req() request: any): string {
    console.log(AppController.name, request.user);
    return this.appService.getHello();
  }
}
