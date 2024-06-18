// src/entity/Application.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Company } from './Company';
import { Document } from './Document';

@Entity({ name: "applications" })
export class Application {
    @PrimaryGeneratedColumn({ name: "application_id" })
    id!: number;

    @ManyToOne(() => Company)
    @JoinColumn({ name: "company_id" })
    company!: Company;

    @Column({ name: "loan_amount", type: "float" })
    loanAmount!: number;

    @Column()
    currency!: string;

    @Column({ name: "loan_type" })
    loanType!: string;

    @Column({ name: "application_status" })
    applicationStatus!: string;

    @Column({ name: "applicant_name" })
    applicantName!: string;

    @Column({ name: "applicant_description" })
    applicantDescription!: string;

    @Column({ name: "applicant_email" })
    applicantEmail!: string;

    @Column({ name: "applicant_phone" })
    applicantPhone?: string;

    @OneToMany(() => Document, document => document.application)
    loanDocuments!: Document[];

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    creator!: User;


    @ManyToOne(() => User)
    @JoinColumn({ name: "modified_by" })
    modifier?: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "assigned_to" })
    assignee?: User;

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ name: "modified_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    modifiedAt!: Date;
}