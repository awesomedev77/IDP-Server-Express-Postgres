// src/entity/Application.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Type } from './Type';
import { Process } from './Process';
import { Document } from './Document';

@Entity({ name: "applications" })
export class Application {
    @PrimaryGeneratedColumn({ name: "application_id" })
    id!: number;

    @ManyToOne(() => Type)
    @JoinColumn({ name: "type_id" })
    documentType!: Type;

    @ManyToOne(() => Process)
    @JoinColumn({ name: "process_id" })
    Process!: Process;

    @Column({ name: "applicant_name" })
    applicantName!: string;

    @Column({ name: "applicant_description" })
    applicantDescription!: string;

    @Column({ name: "applicant_email" })
    applicantEmail!: string;

    @Column({ name: "applicant_phone" })
    applicantPhone?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    creator!: User;


    @ManyToOne(() => User)
    @JoinColumn({ name: "modified_by" })
    modifier?: User;



    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ name: "modified_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    modifiedAt!: Date;
}