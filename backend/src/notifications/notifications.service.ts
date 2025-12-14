import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(createNotificationDto: CreateNotificationDto, senderId: number) {
        const { receiverId, type, title, message } = createNotificationDto;

        if (type === NotificationType.GLOBAL) {
            // For MVP simplicity, we might just store one record with receiverId = null
            // But to let individual users "read" it, we typically duplicate it or have a joining table.
            // For NOW: Let's create a record for ALL users. (Inefficient for millions, fine for 100).
            const users = await this.userRepository.find();
            const notifications = users.map(user => this.notificationRepository.create({
                title,
                message,
                type,
                senderId,
                receiver: user,
                isRead: false
            }));
            return this.notificationRepository.save(notifications);

        } else {
            // Individual
            if (!receiverId) throw new Error('Receiver ID required for INDIVIDUAL type');
            const receiver = await this.userRepository.findOneBy({ id: receiverId });
            if (!receiver) throw new NotFoundException('Receiver not found');

            const notification = this.notificationRepository.create({
                title,
                message,
                type,
                senderId,
                receiver,
                isRead: false
            });
            return this.notificationRepository.save(notification);
        }
    }

    findAll() {
        return this.notificationRepository.find();
    }

    findMyNotifications(userId: number) {
        return this.notificationRepository.find({
            where: { receiver: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }

    async markAsRead(id: number, userId: number) {
        const notification = await this.notificationRepository.findOne({
            where: { id, receiver: { id: userId } }
        });
        if (!notification) throw new NotFoundException('Notification not found');

        notification.isRead = true;
        return this.notificationRepository.save(notification);
    }

    async delete(id: number) {
        return this.notificationRepository.delete(id);
    }
}
