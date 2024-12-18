import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn, OneToOne } from 'typeorm';
import { Client } from './client.entity';
import { Workflow } from './workflow.entity';

@Entity('journals')
export class Journal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    journal_id: string;

    @Column()
    journal_name: string;

    @Column()
    input_path: string;

    @ManyToOne(() => Client, client => client.journals,{
        eager: true,
    })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @Column()
    @Index()
    client_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => Workflow, workflow => workflow.journal,{
        onDelete: 'SET NULL',
        cascade: true,
    })
    workflow: Workflow;
} 