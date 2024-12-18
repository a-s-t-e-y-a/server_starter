import { Entity, ObjectIdColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Workflow } from './workflow.entity';

export enum Status {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    SKIPPED = 'SKIPPED'
}

@Entity('workflow_steps')
export class WorkflowStep {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    order: number;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING
    })
    status: Status;

    @Column({ nullable: true })
    startedAt: Date;

    @Column({ nullable: true })
    endedAt: Date;

    @Column()
    workflowId: string;

    @ManyToOne(() => Workflow, workflow => workflow.steps)
    @JoinColumn({ name: 'workflow_id' })
    workflow: Workflow;

    @Column({ nullable: true })
    parent_step_id: string;

    @ManyToOne(() => WorkflowStep, step => step.child_steps, { nullable: true })
    @JoinColumn({ name: 'parent_step_id' })
    parent_step: WorkflowStep;

    @OneToMany(() => WorkflowStep, step => step.parent_step)
    child_steps: WorkflowStep[];
} 