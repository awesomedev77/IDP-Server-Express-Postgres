import { Request, Response } from 'express';
import { AppDataSource } from '../utils/db';
import { Application } from '../entity/Application';
import { Company } from '../entity/Company';
import { Document } from '../entity/Document';
import { Report } from '../entity/Report';
import { processDocument } from '../utils/processDocument';
import { User } from '../entity/User';
import FormData from 'form-data';
import Axios from 'axios';
import fs from 'fs';


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
  const user = req.user as User;

  try {
    const {
      processId,
    } = req.body;

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const documents = (req.files as Express.Multer.File[]).map((file, index) => {
        const fileType = req.body.fileTypes[index];  // Assuming fileType is sent as an array of strings
        return documentRepository.create({
          status: 'A',
          path: file.path,
          process: { id: processId },
          documentType: { id: fileType },
          creator: { id: user.id }
        })
      });
      for (const document of documents) {
        processDocument(document);
        const formData = new FormData();
        const fileStream = fs.createReadStream(document.path);
        formData.append('file', fileStream, extractFileName(document.path));
        try {
          await Axios.post(`${process.env.API_URL}/report/${document.process.id}`, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
          })
          document.status = "A";
        } catch (e) {
          document.status = 'N';
        }
        documentRepository.save(document);
      };
    }
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add documents" });
  }
};


export const getDocuments = async (req: Request, res: Response) => {
  const documentRepository = AppDataSource.getRepository(Document); const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9; // Default to 9 if limit is not provided
  const user = req.user as User;
  try {
    const [documents, total] = await documentRepository.findAndCount({
      relations: ['creator', 'process', 'documentType'],
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