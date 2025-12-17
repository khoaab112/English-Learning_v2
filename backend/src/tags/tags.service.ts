import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private tagsRepository: Repository<Tag>,
    ) { }

    async create(createTagDto: Partial<Tag>) {
        try {
            return await this.tagsRepository.save(createTagDto);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Tag này đã tồn tại.');
            }
            throw new InternalServerErrorException();
        }
    }

    findAll() {
        return this.tagsRepository.find({ order: { name: 'ASC' } });
    }

    findOne(id: number) {
        return this.tagsRepository.findOneBy({ id });
    }

    update(id: number, updateTagDto: Partial<Tag>) {
        return this.tagsRepository.update(id, updateTagDto);
    }

    remove(id: number) {
        return this.tagsRepository.delete(id);
    }

    findByName(name: string) {
        return this.tagsRepository.findOne({ where: { name } });
    }
}
