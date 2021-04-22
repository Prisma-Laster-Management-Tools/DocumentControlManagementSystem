import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway(80, { namespace: 'notification' })
//@Injectable()
export class NotificationGateway {
  @WebSocketServer()
  server; // to be broadcasting to all people later on ...

  // Instance method to be used from other module/service/controller that made this injected
  test() {
    console.log('works!');
  }
}
