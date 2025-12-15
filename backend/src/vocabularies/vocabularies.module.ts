import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabulariesService } from './vocabularies.service';
import { VocabulariesController } from './vocabularies.controller';
import { Vocabulary } from './entities/vocabulary.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vocabulary])],
    controllers: [VocabulariesController],
    providers: [VocabulariesService],
    exports: [VocabulariesService],
})
export class VocabulariesModule { }
