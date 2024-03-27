import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private readonly socket = io('http://localhost:3001', {
    transports: ['websocket'],
  });

  getReconnectEvent() {
    return new Observable((observer) => {
      this.socket.on('reconnect', () => observer.next());
    });
  }

  joinTodoListRoom(month: string): void {
    this.socket.emit('join:todo-list', month);
  }

  leaveTodoListRoom(month: string): void {
    this.socket.emit('leave:todo-list', month);
  }

  joinTodoRoom(id: string): void {
    this.socket.emit('join:todo', id);
  }

  leaveTodoRoom(id: string): void {
    this.socket.emit('leave:todo', id);
  }

  onTodoAdded(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('todoAdded', (data) => observer.next(data));
    });
  }

  onTodoUpdated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('todoUpdated', (data) => observer.next(data));
    });
  }

  onTodoRemoved(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('todoRemoved', (data) => observer.next(data));
    });
  }
}
