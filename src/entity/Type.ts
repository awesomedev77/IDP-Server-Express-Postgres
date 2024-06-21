import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "document_types" })
export class Type {
    @PrimaryGeneratedColumn({ name: "type_id" })
    id!: number;

    @Column({ name: "type_name" })
    typeName!: string;
}