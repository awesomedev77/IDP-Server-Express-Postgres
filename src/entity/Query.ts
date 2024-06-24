// src/entity/Query.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Message } from './Message';
import { User } from './User';

@Entity({ name: "queries" })
export class Query {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @Column({ name: "process_id" })
    processId!: number;

    @OneToMany(() => Message, message => message.query)
    messages!: Message[];
}