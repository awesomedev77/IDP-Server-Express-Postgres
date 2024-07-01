import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Document } from './Document';
import { DocumentType } from './DocumentType';

@Entity({ name: "types" })
export class Type {
    @PrimaryGeneratedColumn({ name: "type_id" })
    id!: number;

    @Column({ name: "type_name" })
    typeName!: string;

    @OneToMany(() => DocumentType, documentType => documentType.type)
    documents!: DocumentType[];
}