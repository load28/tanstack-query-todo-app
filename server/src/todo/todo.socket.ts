// src/app.gateway.ts
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { cors: 'localhost:4200' })
export class TodoSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:todo-list')
  joinTodoListRoom(client: Socket, month: string) {
    client.join(month);
  }

  @SubscribeMessage('leave:todo-list')
  leaveTodoListRoom(client: Socket, month: string) {
    client.leave(month);
  }

  @SubscribeMessage('join:todo')
  joinTodoRoom(client: Socket, todoId: string) {
    client.join(`todo-${todoId}`);
  }

  @SubscribeMessage('leave:todo')
  leaveTodoRoom(client: Socket, todoId: string) {
    client.leave(`todo-${todoId}`);
  }
}
