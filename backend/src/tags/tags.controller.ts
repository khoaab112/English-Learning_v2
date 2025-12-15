import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createTagDto: Partial<Tag>) {
        return this.tagsService.create(createTagDto);
    }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateTagDto: Partial<Tag>) {
        return this.tagsService.update(+id, updateTagDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.tagsService.remove(+id);
    }
}
