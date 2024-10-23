// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggedInDto } from '../dto/logged-in.dto';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // get roles from decorator
    const roles = this.reflector.get(Roles, context.getHandler())
    console.log('Roles required by route:',roles)
    // if not specific role then allow
    if (!roles) {
      return true;
    }

    // if specific roles then check role
    const request = context.switchToHttp().getRequest();
    const user: LoggedInDto = request.user;
    console.log('User from request:', user)

    // return roles.includes(user.role);

    // Check if the user's role matches any of the allowed roles
    const hasRole = roles.includes(user.role);
    console.log('User has required role:', hasRole);

    return hasRole;
  }
}