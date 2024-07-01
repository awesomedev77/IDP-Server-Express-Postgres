import { Request, Response } from 'express';
import { AppDataSource } from '../utils/db';
import { Document } from '../entity/Document';
import { Report } from '../entity/Report';
import { processDocument } from '../utils/processDocument';
import { User } from '../entity/User';
import FormData from 'form-data';
import Axios from 'axios';
import fs from 'fs';
import { ILike, In } from 'typeorm';
import { DocumentType } from '../entity/DocumentType';
import { Type } from '../entity/Type';

function ensureArray(input: string | string[]): string[] {
  if (Array.isArray(input)) {
    // If input is already an array, return it as is
    return input;
  } else {
    // If input is not an array, convert it to an array with a single element
    return [input];
  }
}

const extractFileName = (path: string): string => {
  // Split the path by the '\' to isolate the file part
  const parts = path.split('\\');
  const fullFileName = parts.pop(); // Get the last element which is the file name with timestamp

  if (!fullFileName) {
    return 'Invalid path'; // Return an error message or handle it as needed
  }

  // Remove the timestamp by splitting on the first dash and taking the rest parts
  const nameParts = fullFileName.split('-');
  nameParts.shift(); // Remove the timestamp part (first element)

  // Rejoin the remaining parts that were split, to handle cases where filename might contain dashes
  return nameParts.join('-');
};


export const addDocuments = async (req: Request, res: Response) => {
  const documentRepository = AppDataSource.getRepository(Document);
  const typeRepository = AppDataSource.getRepository(Type);
  const documentTypeRepository = AppDataSource.getRepository(DocumentType);
  const user = req.user as User;

  try {
    const { processId } = req.body;

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const fileTypes = ensureArray(req.body.fileTypes)
      const documents = await Promise.all((req.files as Express.Multer.File[]).map(async (file, index) => {
        const fileTypeIds = fileTypes[index].split('-').map(Number); // Assuming fileType is sent as an array of strings
        const document = documentRepository.create({
          status: 'A',
          path: file.path,
          process: { id: processId },
          creator: { id: user.id },
        });
        await documentRepository.save(document);

        const documentTypes = fileTypeIds.map((filetypeId: any) => {
          const docType = documentTypeRepository.create({
            document,
            type: { id: filetypeId }
          });
          return documentTypeRepository.save(docType);
        });

        await Promise.all(documentTypes);

        const formData = new FormData();
        const fileStream = fs.createReadStream(document.path);
        formData.append('file', fileStream, extractFileName(document.path));

        try {
          await Axios.post(`${process.env.API_URL}/report/${document.process.id}`, formData, {
            headers: formData.getHeaders()
          });
          document.status = "A";
        } catch (e) {
          document.status = 'N';
        }

        await documentRepository.save(document);
        return document;
      }));

      res.status(201).json({ message: "Documents added successfully", documents });
    } else {
      res.status(400).json({ message: "No files uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add documents" });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  const documentRepository = AppDataSource.getRepository(Document);
  const documentTypeRepository = AppDataSource.getRepository(DocumentType);
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9; // Default to 9 if limit is not provided
  const query = req.query.query;
  const typeFilter = req.query.typeFilter;
  const processFilter = req.query.processFilter;

  try {
    let whereClause: any = {};
    if (query) {
      // Create an OR condition to search in all fields and related fields
      whereClause = [
        { path: ILike(`%${query}%`) },
        {
          creator: {
            fullName: ILike(`%${query}%`),
          }
        },
        {
          creator: {
            role: ILike(`%${query}%`)
          }
        },
        {
          process: {
            processName: ILike(`%${query}%`),
          }
        },
        {
          process: {
            processDescription: ILike(`%${query}%`)
          }
        },
      ];
      if (processFilter && processFilter != "-1") {
        whereClause = whereClause.filter((item: any) => !item.process).map((item: any) => ({
          ...item,
          process: { id: processFilter }
        }));
      }
      if (typeFilter && typeFilter != "-1") {
        const documentIdsWithType = await documentRepository
          .createQueryBuilder('document')
          .leftJoin('document.documentTypes', 'documentType')
          .leftJoin('documentType.type', 'type')
          .where('type.id = :typeId', { typeId: typeFilter })
          .select('document.id')
          .getRawMany();
        const documentIds = documentIdsWithType.map((doc: any) => doc.document_id);
        whereClause = whereClause.map((item: any) => ({
          ...item,
          id: In(documentIds)
        }));
      }
    } else {
      if (processFilter && processFilter != "-1") {
        whereClause.process = { id: processFilter };
      }
      if (typeFilter && typeFilter != "-1") {
        const documentIdsWithType = await documentRepository
          .createQueryBuilder('document')
          .leftJoin('document.documentTypes', 'documentType')
          .leftJoin('documentType.type', 'type')
          .where('type.id = :typeId', { typeId: typeFilter })
          .select('document.id')
          .getRawMany();

        const documentIds = documentIdsWithType.map((doc: any) => doc.document_id);
        whereClause.id = In(documentIds);
      }
    }
    const [documents, total] = await documentRepository.findAndCount({
      relations: ['creator', 'process', 'documentTypes', 'documentTypes.type'],
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      }
    });

    const data = {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: documents
    };
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};