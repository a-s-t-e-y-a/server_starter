import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Journal } from './journal.entity';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    @Index()
    id: string;

    @Column()
    @Index()
    client_id: string;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    address: string;

    @Column()
    billing_information: string;

    @Column()
    customer_contact_person: string;

    @Column()
    sales_person: string;

    @OneToMany(() => Journal, journal => journal.client,{
        onDelete: 'SET NULL',
        cascade: ['insert', 'update'],
    })
    journals: Journal[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
} 