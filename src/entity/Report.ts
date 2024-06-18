import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: "reports" })
export class Report {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "company_name" })
    companyName?: string;

    @Column({ name: "document_type" })
    documentType?: string;

    @Column({ name: "company_description", type: "text" })
    companyDescription?: string;

    @Column("simple-array")
    directors?: string[];

    @Column("simple-array")
    shareholders?: string[];

    @Column({ name: "new_articles", type: "text" })
    newsArticles?: string;

    @Column({ name: "company_risk" })
    companyRisk?: string;

    @Column({ name: "shareholders_risk" })
    shareholdersRisk?: string;

    @Column({ name: "directors_risk" })
    directorsRisk?: string;

    @Column("text")
    explanation?: string;

    @Column({ name: "document_id" })
    documentId?: number;
}