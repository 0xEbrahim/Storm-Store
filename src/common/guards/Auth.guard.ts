import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { JWTService, payloadType } from 'src/modules/jwt/jwt.service';
import { Model } from 'mongoose';
import { User } from 'src/modules/admin/user/Schema/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JWTService,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

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
      const decoded: payloadType =
        await this.jwtService.verifyAccessToken(token);
      const user = await this.UserModel.findById(decoded.id);
      if (!user || !user.active) {
        throw new UnauthorizedException(
          'Deactivated accounts cannot access the website, please contact our support',
        );
      }
      request['user'] = decoded;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }
}
