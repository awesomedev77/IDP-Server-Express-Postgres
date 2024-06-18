// src/entity/Message.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Query } from './Query';

@Entity({ name: "messages" })
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name:"prompt", type:"text"})
    prompt!: string;

    @Column({ nullable: true, name:"answer", type:"text" })
    answer?: string;  

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @ManyToOne(() => Query, query => query.messages)
    @JoinColumn({ name: "query_id" })
    query!: Query;
}