import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/modules/user/Schema/user.schema';

export const ROLES_KEY = 'roles';
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
