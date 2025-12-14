import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Attempt } from '../../attempts/entities/attempt.entity';

export enum DifficultyLevel {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    audioUrl: string;

    @Column({ type: 'text' })
    transcript: string;

    @Column({
        type: 'enum',
        enum: DifficultyLevel,
        default: DifficultyLevel.EASY,
    })
    level: DifficultyLevel;

    @Column({ type: 'int', default: 0 })
    duration: number; // in seconds

    @OneToMany(() => Attempt, (attempt) => attempt.lesson)
    attempts: Attempt[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
