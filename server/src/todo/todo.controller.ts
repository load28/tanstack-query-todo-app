// src/todo/todo.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { TodoSocket } from './todo.socket';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly appGateway: TodoSocket,
  ) {}

  @Get('list/:month')
  async findAll(@Param('month') month: string): Promise<Todo[]> {
    return this.todoService.findAll(month);
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<Todo> {
    return this.todoService.find(id);
  }

  @Post('create')
  async create(@Body() todo: Omit<Todo, 'id'>): Promise<Todo> {
    const newTodo = await this.todoService.create(todo);
    this.appGateway.server.to(todo.month).emit('todoAdded', newTodo);
    return newTodo;
  }

  @Post('update')
  async update(@Body() todo: Todo): Promise<Todo> {
    const updatedTodo = await this.todoService.update(todo);
    this.appGateway.server.to(todo.month).emit('todoUpdated', updatedTodo);
    // this.appGateway.server
    //   .to(`todo-${todo.id}`)
    //   .emit('todoUpdated', updatedTodo);
    return updatedTodo;
  }

  @Post('delete')
  async remove(@Body() { id }: { id: string }): Promise<void> {
    const todo = await this.todoService.find(id);
    await this.todoService.remove(id);
    this.appGateway.server
      .to(String(todo.month))
      .emit('todoRemoved', { month: todo.month, id });
    this.appGateway.server
      .to(`todo-${id}`)
      .emit('todoRemoved', { month: todo.month, id });
  }
}
