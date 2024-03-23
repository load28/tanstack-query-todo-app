import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  readonly socket = io('http://localhost:3001', {
    transports: ['websocket'],
  });

  constructor() {}

  joinTodoListRoom(month: number): void {
    this.socket.emit('join:todo-list', month);
  }

  leaveTodoListRoom(month: number): void {
    this.socket.emit('leave:todo-list', month);
  }

  joinTodoRoom(id: number): void {
    this.socket.emit('join:todo', id);
  }

  leaveTodoRoom(id: number): void {
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
