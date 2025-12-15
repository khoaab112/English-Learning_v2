import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Attempt } from '../../attempts/entities/attempt.entity';
import { Notification } from '../../notifications/entities/notification.entity';

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @Column({ default: 'ACTIVE' }) // ACTIVE, BLOCKED
    status: string;

    @Column({ type: 'text', nullable: true })
    refreshToken: string | null;

    @OneToMany(() => Attempt, (attempt) => attempt.user)
    attempts: Attempt[];

    @OneToMany(() => Notification, (notification) => notification.receiver)
    notifications: Notification[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
