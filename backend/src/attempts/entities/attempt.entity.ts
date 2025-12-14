import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@Entity()
export class Attempt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    lessonId: number;

    @ManyToOne(() => User, (user) => user.attempts)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Lesson, (lesson) => lesson.attempts)
    @JoinColumn({ name: 'lessonId' })
    lesson: Lesson;

    @Column({ type: 'float' })
    score: number;

    @Column({ type: 'text' })
    userText: string;

    @Column({ type: 'json', nullable: true })
    feedback: any; // Store analysis/errors JSON

    @CreateDateColumn()
    createdAt: Date;
}
