import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column({name:"full_name"})
    fullName!: string;

    @Column()
    role!: string; // Assuming 'role' is stored here as per your createUser function

    @Column()
    password!: string;
}