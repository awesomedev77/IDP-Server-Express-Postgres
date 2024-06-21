import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Document } from './Document';
import { User } from './User';

@Entity({ name: "processes" })
export class Process {
    @PrimaryGeneratedColumn({ name: "process_id" })
    id!: number;

    @Column({ name: "process_name" })
    processName!: string;

    @OneToMany(() => Document, document => document.process)
    documents!: Document[];

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    creator!: User;

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ name: "process_description" })
    processDescription!: string;
}