import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { VocabulariesService } from '../vocabularies/vocabularies.service';
import { TagsService } from '../tags/tags.service';

@Controller('sources')
export class SourcesController {
    constructor(
        private readonly sourcesService: SourcesService,
        private readonly vocabulariesService: VocabulariesService,
        private readonly tagsService: TagsService
    ) { }

    @Get()
    getSources() {
        return this.sourcesService.getSources();
    }

    @Get('search')
    async search(@Query('sourceId') sourceId: string, @Query('q') query: string) {
        return this.sourcesService.search(sourceId, query);
    }

    @Get('bulk-preview')
    async bulkPreview(@Query('sourceId') sourceId: string, @Query('count') count: string, @Query('level') level: string, @Query('topic') topic: string) {
        const num = parseInt(count);
        if (isNaN(num) || num <= 0 || num > 100) {
            throw new BadRequestException("Count must be between 1 and 100");
        }
        return this.sourcesService.generateBulk(sourceId, num, level, topic);
    }

    @Post('bulk-import')
    async bulkImport(@Body() body: { sourceId: string, count: number, level?: string, topic?: string }) {
        const { sourceId, count } = body;

        if (!sourceId || !count) throw new BadRequestException("Missing sourceId or count");

        // Fire and forget - Process in background
        this.processBackgroundImport(body).catch(err => {
            console.error("Background Import Failed:", err);
        });

        // Return immediately
        return {
            success: true,
            message: 'Tiến trình đang được thực thi. Vui lòng kiểm tra lại sau ít phút.'
        };
    }

    private async processBackgroundImport(body: { sourceId: string, count: number, level?: string, topic?: string }) {
        const { sourceId, count, level, topic } = body;

        // 1. Fetch data
        const words = await this.sourcesService.generateBulk(sourceId, count, level, topic);

        if (words.length === 0) {
            console.log("Background Import: No words found.");
            return;
        }

        // 2. Prepare Tags (Topic -> Tag)
        let topicTag: any = null;
        if (topic) {
            // Check if tag exists
            topicTag = await this.tagsService.findByName(topic);
            if (!topicTag) {
                // Determine Tag Name: Capitalize first letter
                const tagName = topic.charAt(0).toUpperCase() + topic.slice(1);
                try {
                    topicTag = await this.tagsService.create({ name: tagName, note: 'Auto-imported from Datamuse' });
                } catch (e) {
                    // Race condition or exist check failed
                    topicTag = await this.tagsService.findByName(tagName);
                }
            }
        }

        // 3. Transform to Vocabulary DTOs (map ExternalWord to DB Entity format)
        // Note: VocabulariesService expects objects that look like Vocabulary Entities
        // ExternalWord -> Vocabulary mapping
        const vocabDtos = words.map(w => ({
            word: w.word,
            ipa: w.ipa,
            meaning: w.meaning,
            type: w.type,
            level: (w.level || 'B1') as any, // Cast to any or VocabularyLevel
            example: w.example,
            exampleMeaning: w.exampleMeaning,
            audioUrl: w.audioUrl,
            imageUrl: w.imageUrl,
            tags: topicTag ? [topicTag] : [] // Link the topic tag
        }));

        // 4. Save
        const result = await this.vocabulariesService.createBulk(vocabDtos);
        console.log(`Background Import Completed: imported ${result.created}, skipped ${result.skipped}`);
    }
}
