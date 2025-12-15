import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Vocabulary, VocabularyLevel } from './entities/vocabulary.entity';

@Injectable()
export class VocabulariesService {
    constructor(
        @InjectRepository(Vocabulary)
        private vocabularyRepository: Repository<Vocabulary>,
    ) { }

    async create(createVocabularyDto: Partial<Vocabulary>): Promise<Vocabulary> {
        const newVocab = this.vocabularyRepository.create(createVocabularyDto);
        return this.vocabularyRepository.save(newVocab);
    }

    async findAll(page: number = 1, limit: number = 10, search: string = '', type?: string, level?: string): Promise<{ data: Vocabulary[], total: number, page: number, totalPages: number }> {
        const skip = (page - 1) * limit;

        let where: any = {};
        if (search) {
            where = [
                { word: Like(`%${search}%`) },
                { meaning: Like(`%${search}%`) }
            ];
            // Note: For advanced OR conditions mixed with AND (type/level), TypeORM query builder is better, but simplified approach here:
            // If searching, we check word OR meaning. If Type/Level is also set, it gets complicated with basic FindOptions
            // Let's use QueryBuilder for proper filtering
        }

        const query = this.vocabularyRepository.createQueryBuilder('vocab');

        if (search) {
            query.andWhere('(vocab.word LIKE :search OR vocab.meaning LIKE :search)', { search: `%${search}%` });
        }

        if (type) {
            query.andWhere('vocab.type = :type', { type });
        }

        if (level) {
            query.andWhere('vocab.level = :level', { level });
        }

        // Join tags to display them
        query.leftJoinAndSelect('vocab.tags', 'tag');

        query.orderBy('vocab.id', 'DESC');
        query.skip(skip).take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findOne(id: number): Promise<Vocabulary | null> {
        return this.vocabularyRepository.findOne({ where: { id }, relations: ['tags'] });
    }

    async update(id: number, updateVocabularyDto: Partial<Vocabulary>): Promise<Vocabulary> {
        // Must use save to handle ManyToMany relations properly
        const existing = await this.findOne(id);
        if (!existing) {
            throw new Error('Vocabulary not found');
        }
        // Merge and save
        const updated = this.vocabularyRepository.merge(existing, updateVocabularyDto);
        return this.vocabularyRepository.save(updated);
    }

    async remove(id: number): Promise<void> {
        await this.vocabularyRepository.delete(id);
    }
}
