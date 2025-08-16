import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/modules/Admin/user/Schema/user.schema';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRoles.length == 0) return true;
    const req = context.switchToHttp().getRequest<Request>();
    const userRole = req['user'].role;
    if (!requiredRoles.includes(userRole)) return false;
    return true;
  }
}
