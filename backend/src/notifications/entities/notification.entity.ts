import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
    GLOBAL = 'GLOBAL',
    INDIVIDUAL = 'INDIVIDUAL',
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    message: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.INDIVIDUAL,
    })
    type: NotificationType;

    // Optional: Sender ID (could be an admin user)
    @Column({ nullable: true })
    senderId: number;

    // Optional: Receiver ID (null for GLOBAL)
    @Column({ nullable: true })
    receiverId: number;

    @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
    receiver: User;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
