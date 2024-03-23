import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private readonly socket = io('http://localhost:3000');

  constructor() {
    this.socket.connect();
  }

  joinTodoListRoom(month: number): void {
    this.socket.emit('joinRoom', month);
  }

  leaveTodoListRoom(month: number): void {
    this.socket.emit('leaveRoom', month);
  }

  joinTodoRoom(id: number): void {
    this.socket.emit('joinRoom', `todo-${id}`);
  }

  leaveTodoRoom(id: number): void {
    this.socket.emit('leaveRoom', `todo-${id}`);
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
