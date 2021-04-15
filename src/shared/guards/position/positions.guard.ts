import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/model/user.entity';

const SUPER_ROLE = 'super'; // can access all functionality througout this API {TESTER ONLY}

function matchPositons(allowed_positions: Array<string>, pending_role: string) {
  if (allowed_positions.includes(pending_role)) return true;
  return false;
}

@Injectable()
export class PositionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const positions = this.reflector.get<string[]>(
      'positions',
      context.getHandler(),
    );
    if (!positions) {
      return true;
    }
    const { position: pending_position } = context.switchToHttp().getRequest()
      .user || { positions: false };
    //const pending_position = (request.user.position as string) || false;
    if (!pending_position) return false; // if not event found the position in user or even user itself
    if (pending_position === SUPER_ROLE) return true; // return true instantly
    return matchPositons(positions, pending_position);
  }
}
