import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // throw Error('qwe');
    return 'Hello World!';
  }
}
