import { Injectable } from '@nestjs/common';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { UpdateAttemptDto } from './dto/update-attempt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from './entities/attempt.entity';

@Injectable()
@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(Attempt)
    private attemptRepository: Repository<Attempt>,
  ) { }

  async create(createAttemptDto: CreateAttemptDto) {
    const attempt = this.attemptRepository.create(createAttemptDto);
    return this.attemptRepository.save(attempt);
  }

  findAll() {
    return this.attemptRepository.find({ relations: ['user', 'lesson'] });
  }

  findOne(id: number) {
    return this.attemptRepository.findOne({ where: { id }, relations: ['user', 'lesson'] });
  }

  update(id: number, updateAttemptDto: UpdateAttemptDto) {
    return this.attemptRepository.update(id, updateAttemptDto);
  }

  remove(id: number) {
    return this.attemptRepository.delete(id);
  }
}
