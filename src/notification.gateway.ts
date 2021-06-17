import { Injectable } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(80, { namespace: '/notification' })
//@Injectable()
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    console.log('got connection: ' + client);
  }
  @WebSocketServer()
  wss: Server; // to be broadcasting to all people later on ...

  afterInit(server: any) {
    console.log('[SOCKET-IO]: has been initialized');
  }

  // Instance method to be used from other module/service/controller that made this injected
  test() {
    console.log('works!');
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    const event = 'events';
    //this.wss.emit('events', data);
    return { event, data };
  }

  sendNotificationMessage(data: any) {
    return this.wss.emit('notification', data);
  }
}
