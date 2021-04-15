import { SetMetadata } from '@nestjs/common';

export const Positions = (...positions: string[]) =>
  SetMetadata('positions', positions);
