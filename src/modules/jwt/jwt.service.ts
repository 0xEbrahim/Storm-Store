import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface payloadType {
  id: string;
  role: string;
  active: boolean;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JWTService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async generateAccessToken(payload: payloadType): Promise<string> {
    const token = await this.jwt.signAsync(
      { id: payload.id, role: payload.role, active: payload.active },
      {
        secret: this.config.get<string>('JWT_AC_SEC'),
        expiresIn: this.config.get<string>('JWT_AC_EXP'),
      },
    );
    return token;
  }

  async generateRefreshToken(payload: payloadType): Promise<string> {
    const token = await this.jwt.signAsync(
      { id: payload.id, role: payload.role, active: payload.active },
      {
        secret: this.config.get<string>('JWT_REF_SEC'),
        expiresIn: this.config.get<string>('JWT_REF_EXP'),
      },
    );
    return token;
  }

  async verifyAccessToken(token: string): Promise<payloadType> {
    const payload = await this.jwt.verifyAsync(token, {
      secret: this.config.get<string>('JWT_AC_SEC'),
    });
    return payload;
  }

  async verifyRefreshToken(token: string): Promise<payloadType> {
    const payload = await this.jwt.verifyAsync(token, {
      secret: this.config.get<string>('JWT_REF_SEC'),
    });
    return payload;
  }
}
