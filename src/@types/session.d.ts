import '@nestjs/common';

interface ISessionItems {
  arbitary_data?: any;
  param_cached?: any;
}

declare module '@nestjs/common' {
  export interface Request {
    session: ISessionItems;
  }
}
