import { Module } from '@nestjs/common';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';
import { VocabulariesModule } from '../vocabularies/vocabularies.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [VocabulariesModule, TagsModule],
  controllers: [SourcesController],
  providers: [SourcesService]
})
export class SourcesModule { }
