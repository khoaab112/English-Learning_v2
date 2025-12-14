import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsInt()
    @IsOptional()
    receiverId?: number;
}
