// src/todo/todo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(month: string): Promise<Todo[]> {
    return this.todoRepository.find({ where: { month } });
  }

  async find(id: string): Promise<Todo> {
    return this.todoRepository.findOne({ where: { id } });
  }

  async create(todo: Omit<Todo, 'id'>): Promise<Todo> {
    return this.todoRepository.save(todo);
  }

  async update(todo: Todo): Promise<Todo> {
    await this.todoRepository.update(todo.id, todo);
    return this.todoRepository.findOne({ where: { id: todo.id } });
  }

  async remove(id: string): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
