import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JWTService) {}

  private _extractFromHeaders(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = this._extractFromHeaders(request);
    if (!token)
      throw new UnauthorizedException(
        'Please login first to access this route',
      );
    try {
      const decoded = await this.jwtService.verifyAccessToken(token);
      request['user'] = decoded;
    } catch (e) {
      throw new UnauthorizedException('Invalid JWT');
    }
    return true;
  }
}
