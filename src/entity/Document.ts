// src/entity/Document.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from './Application';

@Entity({ name: "documents" })
export class Document {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    path!: string;

    @Column()
    status!: string;

    @ManyToOne(() => Application, application => application.loanDocuments)
    @JoinColumn({ name: "application_id" })
    application!: Application;
}