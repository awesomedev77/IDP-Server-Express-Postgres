import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Application } from '../entity/Application';
import { Company } from '../entity/Company';
import { User } from '../entity/User'; // Assuming you have a User entity
import { Document } from '../entity/Document';
import { Report } from '../entity/Report';
import { Query } from '../entity/Query';
import { Message } from '../entity/Message';
import { Type } from '../entity/Type';
import { Process } from '../entity/Process';
import { DocumentType } from '../entity/DocumentType';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false, // Note: set this to false in production
    logging: false,
    entities: [User, Company, Application, Document, DocumentType, Report, Query, Message, Type, Process],
    subscribers: [],
    migrations: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });