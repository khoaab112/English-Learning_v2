import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

export enum VocabularyLevel {
    A1 = 'A1',
    A2 = 'A2',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
}

@Entity('vocabularies')
export class Vocabulary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string;

    @Column({ nullable: true })
    ipa: string;

    @Column({ type: 'text' })
    meaning: string;

    @Column({ nullable: true })
    type: string; // n, v, adj, adv

    @Column({
        type: 'enum',
        enum: VocabularyLevel,
        default: VocabularyLevel.A1,
    })
    level: VocabularyLevel;

    @Column({ nullable: true, type: 'text' })
    example: string;

    @Column({ nullable: true, type: 'text' })
    exampleMeaning: string;

    @Column({ nullable: true })
    audioUrl: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true, type: 'text' })
    usageNote: string;

    @Column({ nullable: true, type: 'text' })
    collocation: string;

    @ManyToMany(() => Tag, (tag) => tag.vocabularies, { cascade: true })
    @JoinTable()
    tags: Tag[];

    @Column({ default: 0 })
    popularity: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
