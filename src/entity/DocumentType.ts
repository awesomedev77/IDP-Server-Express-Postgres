import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Document } from './Document';
import { Type } from './Type';

@Entity({ name: "document_type" })
export class DocumentType {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Document, document => document.documentTypes, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: 'document_id' })
    document!: Document;

    @ManyToOne(() => Type, type => type.documents, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: 'type_id' })
    type!: Type;
}