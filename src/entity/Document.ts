// src/entity/Document.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Process } from './Process';
import { Type } from './Type';
import { User } from './User';
@Entity({ name: "documents" })
export class Document {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Type)
    @JoinColumn({ name: "type_id" })
    documentType!: Type;

    @Column()
    path!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    creator!: User;

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column()
    status!: string;

    @ManyToOne(() => Process, process => process.documents)
    @JoinColumn({ name: "process_id" })
    process!: Process;
}