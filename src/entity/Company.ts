// src/entity/Company.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name:"companies"})
export class Company {
    @PrimaryGeneratedColumn({name:"company_id"})
    id!: number;
    
    @Column({name:"company_name"})
    companyName!: string;
    
    @Column({name:"company_tax_number"})
    companyTaxNumber?: string;
    
    @Column({name:"company_location"})
    companyLocation?: string;
}