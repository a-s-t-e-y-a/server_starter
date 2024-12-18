import { Entity, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { WorkflowStep } from './workflow-step.entity';
import { Journal } from './journal.entity';

@Entity('workflows')
@Index(['journalId'])
@Index(['createdAt'])
@Index(['journalId', 'createdAt'])
export class Workflow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    journalId: string;

    @Column()
    name: string;

    @OneToMany(() => WorkflowStep, step => step.workflow)
    steps: WorkflowStep[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Journal, journal => journal.workflow)
    @JoinColumn({ name: 'journal_id' })
    journal: Journal;
} 