import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Vocabulary } from '../../vocabularies/entities/vocabulary.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    note: string;

    @ManyToMany(() => Vocabulary, (vocabulary) => vocabulary.tags)
    vocabularies: Vocabulary[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
