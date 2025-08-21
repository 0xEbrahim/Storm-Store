import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  healthCheck() {
    return { message: 'Application is working' };
  }
}
