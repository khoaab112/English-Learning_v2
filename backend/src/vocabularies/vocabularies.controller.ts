import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service';
import { Vocabulary } from './entities/vocabulary.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vocabularies')
export class VocabulariesController {
    constructor(private readonly vocabulariesService: VocabulariesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createVocabularyDto: Partial<Vocabulary>) {
        return this.vocabulariesService.create(createVocabularyDto);
    }

    @Post('bulk')
    @UseGuards(JwtAuthGuard)
    createBulk(@Body() createVocabularyDtos: Partial<Vocabulary>[]) {
        return this.vocabulariesService.createBulk(createVocabularyDtos);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string = '',
        @Query('type') type: string = '',
        @Query('level') level: string = ''
    ) {
        return this.vocabulariesService.findAll(+page, +limit, search, type, level);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vocabulariesService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateVocabularyDto: Partial<Vocabulary>) {
        return this.vocabulariesService.update(+id, updateVocabularyDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.vocabulariesService.remove(+id);
    }
}
