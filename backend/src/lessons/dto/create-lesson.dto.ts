import { IsString, IsNotEmpty, IsEnum, IsInt, IsOptional, IsUrl } from 'class-validator';
import { DifficultyLevel } from '../entities/lesson.entity';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsNotEmpty()
    audioUrl: string;

    @IsString()
    @IsNotEmpty()
    transcript: string;

    @IsEnum(DifficultyLevel)
    @IsOptional()
    level?: DifficultyLevel;

    @IsInt()
    @IsOptional()
    duration?: number;
}
