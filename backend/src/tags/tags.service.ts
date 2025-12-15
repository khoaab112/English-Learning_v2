import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private tagsRepository: Repository<Tag>,
    ) { }

    create(createTagDto: Partial<Tag>) {
        return this.tagsRepository.save(createTagDto);
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
}
